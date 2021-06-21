import { CustomerModel } from '../../../domain/models/customer'
import { Decrypter } from '../../protocols/crypto/decrypter'
import { LoadCustomerByTokenRepository } from '../../protocols/db/customer/load-customer-by-token-repository'
import { DbLoadCustomerByToken } from './db-load-customer-by-token'

const makeFakeCustomer = (): CustomerModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(ciphertext: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeLoadCustomerByTokenRepository = (): LoadCustomerByTokenRepository => {
  class LoadCustomerByTokenRepositoryStub
    implements LoadCustomerByTokenRepository {
    async loadCustomerByToken(token: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new LoadCustomerByTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoadCustomerByToken
  decrypterStub: Decrypter
  loadCustomerByTokenRepositoryStub: LoadCustomerByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadCustomerByTokenRepositoryStub = makeLoadCustomerByTokenRepository()
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadCustomerByToken(
    decrypterStub,
    loadCustomerByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadCustomerByTokenRepositoryStub
  }
}

describe('DbLoadCustomerByToken UseCase', () => {
  it('should call LoadCustomerByTokenRepository with correct token', async () => {
    const { sut, loadCustomerByTokenRepositoryStub } = makeSut()
    const loadCustomerByTokenSpy = jest.spyOn(
      loadCustomerByTokenRepositoryStub,
      'loadCustomerByToken'
    )
    await sut.loadCustomer('any_id')
    expect(loadCustomerByTokenSpy).toHaveBeenLastCalledWith('any_id')
  })

  it('should throw if LoadCustomerByTokenRepository throws', async () => {
    const { sut, loadCustomerByTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByTokenRepositoryStub, 'loadCustomerByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.loadCustomer('any_id')
    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadCustomerByTokenRepository returns null', async () => {
    const { sut, loadCustomerByTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByTokenRepositoryStub, 'loadCustomerByToken')
      .mockReturnValueOnce(null)
    const accessToken = await sut.loadCustomer('any_id')
    expect(accessToken).toBe(null)
  })
})
