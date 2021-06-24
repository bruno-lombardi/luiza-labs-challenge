import { CustomerModel } from '../../../domain/models/customer'
import { RemoveFavoriteProduct } from '../../../domain/usecases/customer/remove-favorite-product'
import MissingParamError from '../../errors/missing-param-error'

import NotFoundError from '../../errors/not-found-error'
import ProductNotFoundError from '../../errors/product-not-found-error'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { RemoveFavoriteProductController } from './remove-favorite-product-controller'

interface SutTypes {
  sut: RemoveFavoriteProductController
  removeFavoriteCustomerStub: RemoveFavoriteProduct
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    customerId: 'customer_id',
    productId: 'product_id'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeRemoveFavoriteProduct = (): RemoveFavoriteProduct => {
  class RemoveFavoriteProductStub implements RemoveFavoriteProduct {
    async removeFavoriteProductFromCustomer(
      productId: string,
      customerId: string
    ): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new RemoveFavoriteProductStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const removeFavoriteCustomerStub = makeRemoveFavoriteProduct()
  const sut = new RemoveFavoriteProductController(
    validationStub,
    removeFavoriteCustomerStub
  )
  return { sut, validationStub, removeFavoriteCustomerStub }
}

describe('RemoveFavoriteProduct Controller', () => {
  it('should return 200 if valid product id and customer id', async () => {
    const { sut } = makeSut()
    const customer = await sut.handle(makeFakeRequest())
    const fakeCustomer = makeFakeCustomer()
    expect(customer).toEqual(ok(fakeCustomer))
  })

  it('should call RemoveFavoriteProduct with correct value', async () => {
    const { sut, removeFavoriteCustomerStub } = makeSut()
    const removeFavoriteProductSpy = jest.spyOn(
      removeFavoriteCustomerStub,
      'removeFavoriteProductFromCustomer'
    )
    await sut.handle(makeFakeRequest())
    expect(removeFavoriteProductSpy).toHaveBeenCalledWith(
      'product_id',
      'customer_id'
    )
  })

  it('should call Validation with request params', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.params)
  })

  it('should return 400 if Validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should return 404 if customer is not found', async () => {
    const { sut, removeFavoriteCustomerStub } = makeSut()
    jest
      .spyOn(removeFavoriteCustomerStub, 'removeFavoriteProductFromCustomer')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    const notFoundError = new NotFoundError('Customer not found')
    expect(httpResponse).toEqual(notFound(notFoundError))
  })

  it('should return 404 if product is not found', async () => {
    const { sut, removeFavoriteCustomerStub } = makeSut()
    const productNotFoundError = new ProductNotFoundError('Product not found')
    jest
      .spyOn(removeFavoriteCustomerStub, 'removeFavoriteProductFromCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(productNotFoundError))
      )
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(notFound(productNotFoundError))
  })

  it('should return 500 if RemoveFavoriteProduct throws', async () => {
    const { sut, removeFavoriteCustomerStub } = makeSut()
    jest
      .spyOn(removeFavoriteCustomerStub, 'removeFavoriteProductFromCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error())
        })
      )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
