import { Authentication } from '../../../domain/usecases/authentication'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

interface LoginRequestBody {
  email: string
}

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email } = httpRequest.body as LoginRequestBody
      const accessToken = await this.authentication.auth({ email })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
