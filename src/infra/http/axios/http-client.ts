import axios, { AxiosError } from 'axios'
import {
  HttpClient,
  RequestConfig
} from '../../../data/protocols/http/client/http-client'

export class AxiosHttpClient implements HttpClient {
  private readonly url: string

  constructor(baseUrl: string) {
    this.url = baseUrl
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await axios.get(`${this.url}${endpoint}`, config)
      return response.data
    } catch (err) {
      const error = err as AxiosError
      if (error.response && error.response?.status === 404) {
        return null
      }
      throw err
    }
  }
}
