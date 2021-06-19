import { CustomerModel } from '../../../domain/models/customer'
import { AuthParams } from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { LoadCustomerByEmailRepository } from '../../protocols/db/customer/load-customer-by-email-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../protocols/db/customer/update-access-token-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAuthParams = (): AuthParams => ({
  email: 'any_email@email.com'
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com'
})

const makeLoadCustomerByEmailRepository = (): LoadCustomerByEmailRepository => {
  class LoadCustomerByEmailRepositoryStub
    implements LoadCustomerByEmailRepository {
    async loadByEmail(email: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new LoadCustomerByEmailRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(
      updateAccessToken: UpdateAccessTokenModel
    ): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadCustomerByEmailRepositoryStub: LoadCustomerByEmailRepository
  encrypterStub: Encrypter
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadCustomerByEmailRepositoryStub = makeLoadCustomerByEmailRepository()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadCustomerByEmailRepositoryStub,
    encrypterStub,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadCustomerByEmailRepositoryStub,
    encrypterStub,
    updateAccessTokenRepository
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadCustomerByEmailRepository with correct email', async () => {
    const { sut, loadCustomerByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(
      loadCustomerByEmailRepositoryStub,
      'loadByEmail'
    )
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(loadByEmailSpy).toHaveBeenLastCalledWith(authParams.email)
  })

  it('should throw if LoadCustomerByEmailRepository throws', async () => {
    const { sut, loadCustomerByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthParams())
    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadCustomerByEmailRepository returns null', async () => {
    const { sut, loadCustomerByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)
    const authParams = makeFakeAuthParams()
    const accessToken = await sut.auth(authParams)
    expect(accessToken).toBe(null)
  })

  it('should call Encrypter with correct customer id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(generateSpy).toHaveBeenLastCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthParams())
    expect(promise).rejects.toThrow()
  })

  it('should return access token if TokenGenerator called with valid id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthParams())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with customer id and token', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepository,
      'updateAccessToken'
    )
    const authParams = makeFakeAuthParams()
    await sut.auth(authParams)
    expect(updateSpy).toHaveBeenLastCalledWith({
      customerId: 'any_id',
      token: 'any_token'
    })
  })
})
