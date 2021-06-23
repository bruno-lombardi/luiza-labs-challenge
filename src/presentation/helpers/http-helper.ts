import ServerError from '../errors/server-error'
import UnauthorizedError from '../errors/unauthorized-error'
import { HttpResponse } from '../protocols/http'

export const ok = (data: Record<string, any>): HttpResponse => ({
  body: data,
  statusCode: 200
})

export const noContent = (): HttpResponse => ({
  body: undefined,
  statusCode: 204
})

export const badRequest = (error: Error): HttpResponse => ({
  body: error,
  statusCode: 400
})

export const unauthorized = (): HttpResponse => ({
  body: new UnauthorizedError(),
  statusCode: 401
})

export const forbidden = (error: Error): HttpResponse => ({
  body: error,
  statusCode: 403
})

export const notFound = (error: Error): HttpResponse => ({
  body: error,
  statusCode: 404
})

export const conflict = (error: Error): HttpResponse => ({
  body: error,
  statusCode: 409
})

export const serverError = (error: Error): HttpResponse => ({
  body: new ServerError(error.stack),
  statusCode: 500
})
