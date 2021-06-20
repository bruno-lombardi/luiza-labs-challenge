import { CustomerModel } from '../../../domain/models/customer'
import { LoadCustomerByIdRepository } from '../../protocols/db/customer/load-customer-by-id-repository'
import { DbGetCustomer } from './db-get-customer'
const makeFakeCustomer = (): CustomerModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com'
})

const makeLoadCustomerByIdRepository = (): LoadCustomerByIdRepository => {
  class LoadCustomerByIdRepositoryStub implements LoadCustomerByIdRepository {
    async loadById(email: string): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new LoadCustomerByIdRepositoryStub()
}

interface SutTypes {
  sut: DbGetCustomer
  loadCustomerByIdRepositoryStub: LoadCustomerByIdRepository
}

const makeSut = (): SutTypes => {
  const loadCustomerByIdRepositoryStub = makeLoadCustomerByIdRepository()

  const sut = new DbGetCustomer(loadCustomerByIdRepositoryStub)

  return {
    sut,
    loadCustomerByIdRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadCustomerByIdRepository with correct email', async () => {
    const { sut, loadCustomerByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadCustomerByIdRepositoryStub, 'loadById')
    await sut.getCustomerById('any_id')
    expect(loadByIdSpy).toHaveBeenLastCalledWith('any_id')
  })

  it('should throw if LoadCustomerByIdRepository throws', async () => {
    const { sut, loadCustomerByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.getCustomerById('any_id')
    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadCustomerByIdRepository returns null', async () => {
    const { sut, loadCustomerByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadCustomerByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(null)
    const accessToken = await sut.getCustomerById('any_id')
    expect(accessToken).toBe(null)
  })
})
