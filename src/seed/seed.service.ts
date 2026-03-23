import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>,
    private readonly _http: AxiosAdapter,
  ) {}
  async executeSeed() {
    await this.pokeModel.deleteMany({}); // Eliminar todos antes de ejecutar seed.

    const data = await this._http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    // const insertPromisesArray: Promise<Pokemon>[] = []; Para Hacerlo con promesas
    const pokemonsToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/'); // 'https://pokeapi.co/api/v2/pokemon/12
      const no = +segments[segments.length - 2];
      const pokemonToInsert = { name, no };

      // await this.pokeModel.create(pokemonToInsert); // Se demora mucho si fuesen muchos pokemones, es mejor insertar todos de una.
      // insertPromisesArray.push(this.pokeModel.create(pokemonToInsert)); Esto es para hacerlo con promesas
      pokemonsToInsert.push(pokemonToInsert);
    });
    //await Promise.all(insertPromisesArray); Para hacerlo con promesas
    await this.pokeModel.insertMany(pokemonsToInsert);
    return 'Seed executed';
  }
}
