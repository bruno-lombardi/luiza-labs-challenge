import { DeleteCustomer } from '../../../domain/usecases/customer/delete-customer'
import NotFoundError from '../../errors/not-found-error'
import {
  badRequest,
  noContent,
  notFound,
  serverError
} from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class DeleteCustomerController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly deleteCustomer: DeleteCustomer
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const customerId = httpRequest.params.customerId
      const isDeleted = await this.deleteCustomer.deleteCustomerById(customerId)
      if (!isDeleted) {
        return notFound(new NotFoundError('Customer not found'))
      }
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
