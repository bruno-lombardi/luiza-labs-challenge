import { LoadCustomerByToken } from '../../domain/usecases/customer/load-customer-by-token'
import AccessDeniedError from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadCustomerByToken: LoadCustomerByToken) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers?.authorization
      if (accessToken) {
        const customer = await this.loadCustomerByToken.loadCustomer(
          accessToken
        )
        if (customer) {
          return ok({ customerId: customer.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
