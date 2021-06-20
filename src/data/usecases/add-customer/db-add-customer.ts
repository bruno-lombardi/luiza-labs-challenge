import { CustomerModel } from '../../../domain/models/customer'
import {
  AddCustomer,
  AddCustomerModel
} from '../../../domain/usecases/customer/add-customer'
import { AddCustomerRepository } from '../../protocols/db/customer/add-customer-repository'

export class DbAddCustomer implements AddCustomer {
  constructor(private readonly addCustomerRepository: AddCustomerRepository) {}

  async add(customerData: AddCustomerModel): Promise<CustomerModel> {
    const customer = await this.addCustomerRepository.add(customerData)
    return customer
  }
}
