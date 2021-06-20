import { UpdateCustomer } from '../../../domain/usecases/customer/update-customer'
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

export class UpdateCustomerController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateCustomer: UpdateCustomer
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const customerId = httpRequest.params.customerId
      const updateData = {
        id: customerId,
        name: httpRequest.body.name,
        email: httpRequest.body.email
      }
      const customer = await this.updateCustomer.updateCustomer(updateData)
      if (!customer) {
        return notFound(new NotFoundError('Customer not found'))
      }
      return ok(customer)
    } catch (err) {
      return serverError(err)
    }
  }
}
