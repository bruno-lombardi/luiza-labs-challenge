import { CustomerModel } from '../../../../domain/models/customer'
import { UpdateCustomerModel } from '../../../../domain/usecases/customer/update-customer'
import { UpdateCustomerRepository } from '../../../protocols/db/customer/update-customer-repository'
import { DbUpdateCustomer } from './db-update-costumer'

const makeFakeCustomer = (): CustomerModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  favoriteProducts: []
})

const makeFakeUpdateCustomerModel = (): UpdateCustomerModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com'
})

const makeUpdateCustomerRepository = (): UpdateCustomerRepository => {
  class UpdateCustomerRepositoryStub implements UpdateCustomerRepository {
    async updateCustomer(
      updateCustomerModel: UpdateCustomerModel
    ): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new UpdateCustomerRepositoryStub()
}

interface SutTypes {
  sut: DbUpdateCustomer
  updateCustomerRepository: UpdateCustomerRepository
}

const makeSut = (): SutTypes => {
  const updateCustomerRepository = makeUpdateCustomerRepository()

  const sut = new DbUpdateCustomer(updateCustomerRepository)

  return {
    sut,
    updateCustomerRepository
  }
}

describe('DbUpdateCustomer UseCase', () => {
  it('should call UpdateCustomerRepository with correct update data', async () => {
    const { sut, updateCustomerRepository } = makeSut()
    const updateCustomerSpy = jest.spyOn(
      updateCustomerRepository,
      'updateCustomer'
    )
    const updateData = makeFakeUpdateCustomerModel()
    await sut.updateCustomer(updateData)
    expect(updateCustomerSpy).toHaveBeenLastCalledWith(updateData)
  })

  it('should throw if UpdateCustomerRepository throws', async () => {
    const { sut, updateCustomerRepository } = makeSut()
    jest
      .spyOn(updateCustomerRepository, 'updateCustomer')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.updateCustomer(makeFakeUpdateCustomerModel())
    expect(promise).rejects.toThrow()
  })

  it('should return null if UpdateCustomerRepository returns null', async () => {
    const { sut, updateCustomerRepository } = makeSut()
    jest
      .spyOn(updateCustomerRepository, 'updateCustomer')
      .mockReturnValueOnce(null)
    const customer = await sut.updateCustomer(makeFakeUpdateCustomerModel())
    expect(customer).toBe(null)
  })
})
