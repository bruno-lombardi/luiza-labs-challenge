import { CustomerModel } from '../../../../domain/models/customer'
import { AddCustomerModel } from '../../../../domain/usecases/customer/add-customer'
import { AddCustomerRepository } from '../../../protocols/db/customer/add-customer-repository'
import { DbAddCustomer } from './db-add-customer'

const makeFakeCustomerData = (): AddCustomerModel => ({
  name: 'valid_name',
  email: 'valid_email@email.com'
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeAddCustomerRepository = (): AddCustomerRepository => {
  class AddCustomerRepositoryStub implements AddCustomerRepository {
    async add(customer: AddCustomerModel): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new AddCustomerRepositoryStub()
}

interface SutTypes {
  sut: DbAddCustomer
  addCustomerRepositoryStub: AddCustomerRepository
}

const makeSut = (): SutTypes => {
  const addCustomerRepositoryStub = makeAddCustomerRepository()
  const sut = new DbAddCustomer(addCustomerRepositoryStub)
  return {
    sut,
    addCustomerRepositoryStub
  }
}

describe('DbAddCustomer UseCase', () => {
  it('should call AddCustomerRepository with correct values', async () => {
    const { sut, addCustomerRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addCustomerRepositoryStub, 'add')
    await sut.add(makeFakeCustomerData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com'
    })
  })

  it('should throw if repository throws exception', async () => {
    const { sut, addCustomerRepositoryStub } = makeSut()
    jest
      .spyOn(addCustomerRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(makeFakeCustomerData())
    await expect(promise).rejects.toThrow()
  })

  it('should return a customer on success', async () => {
    const { sut } = makeSut()
    const customer = await sut.add(makeFakeCustomerData())
    expect(customer).toEqual(makeFakeCustomer())
  })
})
