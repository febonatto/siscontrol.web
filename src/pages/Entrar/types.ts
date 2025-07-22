import { AxiosError, AxiosResponse } from 'axios';
import { z } from 'zod';
import { entrarSchema } from './constants';

export type EntrarForm = z.infer<typeof entrarSchema>;

export interface EntrarData {
  accessToken: string;
  message: string;
}

export type EntrarResponse = AxiosResponse<EntrarData>;

export type EntrarParams = EntrarForm;

type EntrarErrorData = {
  message: string;
  statusCode: number;
  error: string;
};

export type EntrarError = AxiosError<EntrarErrorData>;
