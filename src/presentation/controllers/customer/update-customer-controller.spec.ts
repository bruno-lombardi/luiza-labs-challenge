import { CustomerModel } from '../../../domain/models/customer'
import {
  UpdateCustomer,
  UpdateCustomerModel
} from '../../../domain/usecases/customer/update-customer'
import NotFoundError from '../../errors/not-found-error'
import { notFound, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { UpdateCustomerController } from './update-customer-controller'
interface SutTypes {
  sut: UpdateCustomerController
  updateCustomerStub: UpdateCustomer
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    customerId: 'valid_id'
  },
  body: {
    name: 'new_name',
    email: 'new_email@email.com'
  }
})

const makeFakeCustomerData = (): UpdateCustomerModel => ({
  id: 'valid_id',
  email: 'new_email@email.com',
  name: 'new_name'
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeUpdateCustomer = (): UpdateCustomer => {
  class UpdateCustomerStub implements UpdateCustomer {
    async updateCustomer(
      updateCustomerModel: UpdateCustomerModel
    ): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new UpdateCustomerStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const updateCustomerStub = makeUpdateCustomer()
  const sut = new UpdateCustomerController(validationStub, updateCustomerStub)
  return { sut, validationStub, updateCustomerStub }
}

describe('UpdateCustomer Controller', () => {
  it('should call UpdateCustomer with correct value', async () => {
    const { sut, updateCustomerStub } = makeSut()
    const getCustomerSpy = jest.spyOn(updateCustomerStub, 'updateCustomer')
    await sut.handle(makeFakeRequest())
    expect(getCustomerSpy).toHaveBeenCalledWith(makeFakeCustomerData())
  })

  it('should return 404 if customer is not found', async () => {
    const { sut, updateCustomerStub } = makeSut()
    jest
      .spyOn(updateCustomerStub, 'updateCustomer')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    const notFoundError = new NotFoundError('Customer not found')
    expect(httpResponse).toEqual(notFound(notFoundError))
  })

  it('should return 500 if UpdateCustomer throws', async () => {
    const { sut, updateCustomerStub } = makeSut()
    jest.spyOn(updateCustomerStub, 'updateCustomer').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
