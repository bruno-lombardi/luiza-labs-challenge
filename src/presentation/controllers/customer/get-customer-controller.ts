import { GetCustomer } from '../../../domain/usecases/customer/get-customer'
import NotFoundError from '../../errors/not-found-error'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class GetCustomerController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly getCustomer: GetCustomer
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const customerId = httpRequest.params.customerId
      const customer = await this.getCustomer.getCustomerById(customerId)
      if (!customer) {
        return notFound(new NotFoundError('Customer not found'))
      }
      return ok(customer)
    } catch (err) {
      return serverError(err)
    }
  }
}
