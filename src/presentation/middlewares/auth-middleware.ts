import { LoadCustomerByToken } from '../../domain/usecases/customer/load-customer-by-token'
import AccessDeniedError from '../errors/access-denied-error'
import {
  forbidden,
  ok,
  serverError,
  unauthorized
} from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadCustomerByToken: LoadCustomerByToken) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const authorization = request.headers?.authorization
      const customerId = request.params?.customerId

      if (!authorization) return unauthorized()

      const accessToken = authorization.split(' ')[1]
      if (accessToken) {
        const customer = await this.loadCustomerByToken.loadCustomer(
          accessToken
        )
        if (customer && customer.id === customerId) {
          return ok({ customerId: customer.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
