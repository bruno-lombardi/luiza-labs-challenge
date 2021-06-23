import { CustomerModel } from '../../../domain/models/customer'
import { ProductModel } from '../../../domain/models/product'
import { AddFavoriteProduct } from '../../../domain/usecases/customer/add-favorite-product'

import NotFoundError from '../../errors/not-found-error'
import ProductAlreadyFavoritedError from '../../errors/product-already-favorited-error'
import ProductNotFoundError from '../../errors/product-not-found-error'
import { conflict, notFound, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { AddFavoriteProductController } from './add-favorite-product-controller'

interface SutTypes {
  sut: AddFavoriteProductController
  addFavoriteCustomerStub: AddFavoriteProduct
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

const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'any_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: [makeFakeProduct()]
})

const makeAddFavoriteProduct = (): AddFavoriteProduct => {
  class AddFavoriteProductStub implements AddFavoriteProduct {
    async addFavoriteProductToCustomer(
      productId: string,
      customerId: string
    ): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new AddFavoriteProductStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addFavoriteCustomerStub = makeAddFavoriteProduct()
  const sut = new AddFavoriteProductController(
    validationStub,
    addFavoriteCustomerStub
  )
  return { sut, validationStub, addFavoriteCustomerStub }
}

describe('AddFavoriteProduct Controller', () => {
  it('should return 200 if valid product id and customer id', async () => {
    const { sut } = makeSut()
    const customer = await sut.handle(makeFakeRequest())
    const fakeCustomer = makeFakeCustomer()
    expect(customer).toEqual(ok(fakeCustomer))
  })

  it('should call AddFavoriteProduct with correct value', async () => {
    const { sut, addFavoriteCustomerStub } = makeSut()
    const addFavoriteProductSpy = jest.spyOn(
      addFavoriteCustomerStub,
      'addFavoriteProductToCustomer'
    )
    await sut.handle(makeFakeRequest())
    expect(addFavoriteProductSpy).toHaveBeenCalledWith(
      'product_id',
      'customer_id'
    )
  })

  it('should return 404 if customer is not found', async () => {
    const { sut, addFavoriteCustomerStub } = makeSut()
    jest
      .spyOn(addFavoriteCustomerStub, 'addFavoriteProductToCustomer')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    const notFoundError = new NotFoundError('Customer not found')
    expect(httpResponse).toEqual(notFound(notFoundError))
  })

  it('should return 404 if product is not found', async () => {
    const { sut, addFavoriteCustomerStub } = makeSut()
    const productNotFoundError = new ProductNotFoundError('Product not found')
    jest
      .spyOn(addFavoriteCustomerStub, 'addFavoriteProductToCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(productNotFoundError))
      )
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(notFound(productNotFoundError))
  })

  it('should return 409 if product is already favorited by customer', async () => {
    const { sut, addFavoriteCustomerStub } = makeSut()
    const alreadyFavoritedError = new ProductAlreadyFavoritedError(
      'This customer already favorited this product'
    )
    jest
      .spyOn(addFavoriteCustomerStub, 'addFavoriteProductToCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(alreadyFavoritedError))
      )
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(conflict(alreadyFavoritedError))
  })

  it('should return 500 if AddFavoriteProduct throws', async () => {
    const { sut, addFavoriteCustomerStub } = makeSut()
    jest
      .spyOn(addFavoriteCustomerStub, 'addFavoriteProductToCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error())
        })
      )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
