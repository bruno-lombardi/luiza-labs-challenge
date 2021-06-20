import { DeleteCustomer } from '../../../domain/usecases/customer/delete-customer'
import { DeleteCustomerRepository } from '../../protocols/db/customer/delete-customer-repository'

export class DbDeleteCustomer implements DeleteCustomer {
  constructor(
    private readonly deleteCustomerByIdRepository: DeleteCustomerRepository
  ) {}

  async deleteCustomerById(customerId: string): Promise<boolean> {
    const customer = await this.deleteCustomerByIdRepository.deleteCustomerById(
      customerId
    )
    return customer
  }
}
