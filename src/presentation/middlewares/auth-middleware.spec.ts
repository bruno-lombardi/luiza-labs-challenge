import { CustomerModel } from '../../domain/models/customer'
import { LoadCustomerByToken } from '../../domain/usecases/customer/load-customer-by-token'
import AccessDeniedError from '../errors/access-denied-error'
import {
  forbidden,
  ok,
  serverError,
  unauthorized
} from '../helpers/http-helper'
import { HttpRequest } from '../protocols/http'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadCustomerByTokenStub: LoadCustomerByToken
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    authorization: 'Bearer any_token'
  },
  params: {
    customerId: 'valid_id'
  }
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeLoadCustomerByToken = (): LoadCustomerByToken => {
  class LoadCustomerByTokenStub implements LoadCustomerByToken {
    async loadCustomer(customerId: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new LoadCustomerByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadCustomerByTokenStub = makeLoadCustomerByToken()
  const sut = new AuthMiddleware(loadCustomerByTokenStub)
  return { sut, loadCustomerByTokenStub }
}

describe('AuthMiddleware', () => {
  it('Should return 401 if authorization header is missing', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should call LoadCustomerByToken with correct accessToken', async () => {
    const { sut, loadCustomerByTokenStub } = makeSut()
    const loadCustomerByTokenSpy = jest.spyOn(
      loadCustomerByTokenStub,
      'loadCustomer'
    )
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadCustomerByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return 403 if LoadCustomerByToken returns null', async () => {
    const { sut, loadCustomerByTokenStub } = makeSut()
    jest
      .spyOn(loadCustomerByTokenStub, 'loadCustomer')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadCustomerByToken returns a customer id', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        customerId: 'valid_id'
      })
    )
  })

  it('Should return 500 if LoadCustomerByToken throws', async () => {
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
