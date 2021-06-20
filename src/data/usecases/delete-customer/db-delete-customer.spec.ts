import { DeleteCustomerRepository } from '../../protocols/db/customer/delete-customer-repository'
import { DbDeleteCustomer } from './db-delete-customer'
const makeDeleteCustomerRepository = (): DeleteCustomerRepository => {
  class DeleteCustomerRepositoryStub implements DeleteCustomerRepository {
    async deleteCustomerById(customerId: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }
  return new DeleteCustomerRepositoryStub()
}

interface SutTypes {
  sut: DbDeleteCustomer
  deleteCustomerRepository: DeleteCustomerRepository
}

const makeSut = (): SutTypes => {
  const deleteCustomerRepository = makeDeleteCustomerRepository()

  const sut = new DbDeleteCustomer(deleteCustomerRepository)

  return {
    sut,
    deleteCustomerRepository
  }
}

describe('DbDeleteCustomer UseCase', () => {
  it('should call DeleteCustomerRepository with correct email', async () => {
    const { sut, deleteCustomerRepository } = makeSut()
    const deleteCustomerByIdSpy = jest.spyOn(
      deleteCustomerRepository,
      'deleteCustomerById'
    )
    await sut.deleteCustomerById('valid_id')
    expect(deleteCustomerByIdSpy).toHaveBeenLastCalledWith('valid_id')
  })

  it('should throw if DeleteCustomerRepository throws', async () => {
    const { sut, deleteCustomerRepository } = makeSut()
    jest
      .spyOn(deleteCustomerRepository, 'deleteCustomerById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.deleteCustomerById('valid_id')
    expect(promise).rejects.toThrow()
  })

  it('should return false if DeleteCustomerRepository returns false', async () => {
    const { sut, deleteCustomerRepository } = makeSut()
    jest
      .spyOn(deleteCustomerRepository, 'deleteCustomerById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const customer = await sut.deleteCustomerById('valid_id')
    expect(customer).toBe(false)
  })
})
