import { RemoveFavoriteProduct } from '../../../domain/usecases/customer/remove-favorite-product'
import NotFoundError from '../../errors/not-found-error'
import ProductNotFoundError from '../../errors/product-not-found-error'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validation'

export class RemoveFavoriteProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly removeFavoriteProduct: RemoveFavoriteProduct
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const customerId = httpRequest.params.customerId
      const productId = httpRequest.params.productId

      const customer = await this.removeFavoriteProduct.removeFavoriteProductFromCustomer(
        productId,
        customerId
      )
      if (!customer) {
        return notFound(new NotFoundError('Customer not found'))
      }

      return ok(customer)
    } catch (err) {
      if (err instanceof ProductNotFoundError) {
        return notFound(err)
      }

      return serverError(err)
    }
  }
}
