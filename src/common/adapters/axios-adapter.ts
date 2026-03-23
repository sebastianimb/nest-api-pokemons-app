import axios, { AxiosInstance } from 'axios';
import { httpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements httpAdapter {
  private _axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this._axios.get<T>(url);
      return data;
    } catch {
      throw new Error('This is an error - Check logs');
    }
  }
}
