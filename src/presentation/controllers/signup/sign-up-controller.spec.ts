import MissingParamError from '../../errors/missing-param-error'
import ServerError from '../../errors/server-error'
import { SignUpController } from './sign-up-controller'
import {
  AddCustomer,
  AddCustomerModel
} from '../../../domain/usecases/customer/add-customer'
import { CustomerModel } from '../../../domain/models/customer'
import { HttpRequest } from '../../protocols/http'
import {
  badRequest,
  conflict,
  ok,
  serverError
} from '../../helpers/http-helper'
import { Validation } from '../../protocols/validation'
import CustomerAlreadyExistsError from '../../errors/customer-already-exists-error'

interface SutTypes {
  sut: SignUpController
  addCustomerStub: AddCustomer
  validationStub: Validation
}

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeAddCustomer = (): AddCustomer => {
  class AddCustomerStub implements AddCustomer {
    async add(customer: AddCustomerModel): Promise<CustomerModel> {
      return await new Promise((resolve, reject) => resolve(makeFakeCustomer()))
    }
  }
  return new AddCustomerStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'username',
    email: 'user@email.com',
    email_confirmation: 'user@email.com'
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

const makeSut = (): SutTypes => {
  const addCustomerStub = makeAddCustomer()
  const validationStub = makeValidation()
  const sut = new SignUpController(addCustomerStub, validationStub)
  return {
    sut,
    addCustomerStub,
    validationStub
  }
}

describe('SignUpController', () => {
  it('should call AddCustomer with correct values', async () => {
    const { sut, addCustomerStub } = makeSut()
    const addSpy = jest.spyOn(addCustomerStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'username',
      email: 'user@email.com'
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeCustomer()))
  })

  it('should call Validation with request body', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should return 409 if AddCustomer throws CustomerAlreadyExistsError', async () => {
    const { sut, addCustomerStub } = makeSut()
    const customerAlreadyExists = new CustomerAlreadyExistsError(
      'Customer already exists'
    )
    jest.spyOn(addCustomerStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) =>
        reject(customerAlreadyExists)
      )
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(conflict(customerAlreadyExists))
  })

  it('should return 500 if AddCustomer throws exception', async () => {
    const { sut, addCustomerStub } = makeSut()
    jest.spyOn(addCustomerStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
