import { CustomerModel } from '../../../domain/models/customer'
import { GetCustomer } from '../../../domain/usecases/customer/get-customer'
import MissingParamError from '../../errors/missing-param-error'
import NotFoundError from '../../errors/not-found-error'
import {
  badRequest,
  ok,
  serverError,
  notFound
} from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { GetCustomerController } from './get-customer-controller'

interface SutTypes {
  sut: GetCustomerController
  getCustomerStub: GetCustomer
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    customerId: 'any_id'
  }
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com'
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeGetCustomer = (): GetCustomer => {
  class GetCustomerStub implements GetCustomer {
    async getCustomerById(customerId: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new GetCustomerStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const getCustomerStub = makeGetCustomer()
  const sut = new GetCustomerController(validationStub, getCustomerStub)
  return { sut, validationStub, getCustomerStub }
}

describe('GetCustomerController', () => {
  it('should call GetCustomer with correct value', async () => {
    const { sut, getCustomerStub } = makeSut()
    const getCustomerSpy = jest.spyOn(getCustomerStub, 'getCustomerById')
    await sut.handle(makeFakeRequest())
    expect(getCustomerSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return 404 if customer is not found', async () => {
    const { sut, getCustomerStub } = makeSut()
    jest
      .spyOn(getCustomerStub, 'getCustomerById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    const notFoundError = new NotFoundError('Customer not found')
    expect(httpResponse).toEqual(notFound(notFoundError))
  })

  it('should return 500 if GetCustomer throws', async () => {
    const { sut, getCustomerStub } = makeSut()
    jest.spyOn(getCustomerStub, 'getCustomerById').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid id and customer is found', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    const fakeCustomer = makeFakeCustomer()
    expect(httpResponse).toEqual(ok(fakeCustomer))
  })

  it('should return 400 if Validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
