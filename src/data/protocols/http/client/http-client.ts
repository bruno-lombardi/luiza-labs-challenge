export interface RequestConfig {
  headers?: any
  timeout?: number
  params?: any
}

export interface HttpClient {
  get: <T>(endpoint: string, config?: RequestConfig) => Promise<T>
}
