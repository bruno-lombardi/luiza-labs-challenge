import { CustomerModel } from '../../../../domain/models/customer'
import {
  UpdateCustomer,
  UpdateCustomerModel
} from '../../../../domain/usecases/customer/update-customer'
import { UpdateCustomerRepository } from '../../../protocols/db/customer/update-customer-repository'

export class DbUpdateCustomer implements UpdateCustomer {
  constructor(
    private readonly updateCustomerByIdRepository: UpdateCustomerRepository
  ) {}

  async updateCustomer(
    updateCustomerModel: UpdateCustomerModel
  ): Promise<CustomerModel> {
    const customer = await this.updateCustomerByIdRepository.updateCustomer(
      updateCustomerModel
    )
    return customer
  }
}
