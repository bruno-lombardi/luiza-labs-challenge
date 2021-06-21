import { CustomerModel } from '../../domain/models/customer'
import { LoadCustomerByToken } from '../../domain/usecases/customer/load-customer-by-token'
import AccessDeniedError from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { HttpRequest } from '../protocols/http'
import { Validation } from '../protocols/validation'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadCustomerByTokenStub: LoadCustomerByToken
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any_token'
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

const makeLoadCustomerByToken = (): LoadCustomerByToken => {
  class LoadCustomerByTokenStub implements LoadCustomerByToken {
    async loadCustomer(customerId: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new LoadCustomerByTokenStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadCustomerByTokenStub = makeLoadCustomerByToken()
  const sut = new AuthMiddleware(loadCustomerByTokenStub)
  return { sut, validationStub, loadCustomerByTokenStub }
}

describe('AuthMiddleware', () => {
  test('Should return 403 if no authorization exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadCustomerByToken with correct accessToken', async () => {
    const { sut, loadCustomerByTokenStub } = makeSut()
    const loadCustomerByTokenSpy = jest.spyOn(
      loadCustomerByTokenStub,
      'loadCustomer'
    )
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadCustomerByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 403 if LoadCustomerByToken returns null', async () => {
    const { sut, loadCustomerByTokenStub } = makeSut()
    jest
      .spyOn(loadCustomerByTokenStub, 'loadCustomer')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadCustomerByToken returns a customer id', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        customerId: 'valid_id'
      })
    )
  })

  test('Should return 500 if LoadCustomerByToken throws', async () => {
    const { sut, loadCustomerByTokenStub } = makeSut()
    jest
      .spyOn(loadCustomerByTokenStub, 'loadCustomer')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
