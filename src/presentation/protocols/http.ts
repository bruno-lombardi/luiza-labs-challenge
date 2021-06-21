export interface HttpResponse {
  statusCode: number
  body: Record<string, any>
}

export interface HttpRequest {
  body?: Record<string, any>
  params?: Record<string, any>
  headers?: Record<string, any>
}
