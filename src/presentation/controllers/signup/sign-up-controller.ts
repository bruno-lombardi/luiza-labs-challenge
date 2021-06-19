import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { AddCustomer } from '../../../domain/usecases/add-customer'
import { Validation } from '../../protocols/validation'

interface SignUpRequestBody {
  name: string
  email: string
  email_confirmation: string
}

export class SignUpController implements Controller {
  constructor(
    private readonly addCustomer: AddCustomer,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email } = httpRequest.body as SignUpRequestBody
      const customer = await this.addCustomer.add({
        name,
        email
      })
      return ok(customer)
    } catch (err) {
      return serverError(err)
    }
  }
}
