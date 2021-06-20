import { CustomerModel } from '../../../domain/models/customer'
import { GetCustomer } from '../../../domain/usecases/customer/get-customer'
import { LoadCustomerByIdRepository } from '../../protocols/db/customer/load-customer-by-id-repository'

export class DbGetCustomer implements GetCustomer {
  constructor(
    private readonly loadCustomerByIdRepository: LoadCustomerByIdRepository
  ) {}

  async getCustomerById(customerId: string): Promise<CustomerModel> {
    const customer = await this.loadCustomerByIdRepository.loadById(customerId)
    return customer
  }
}
