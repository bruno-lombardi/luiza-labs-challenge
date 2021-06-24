import { CustomerModel } from '../../../../domain/models/customer'
import {
  AddCustomer,
  AddCustomerModel
} from '../../../../domain/usecases/customer/add-customer'
import CustomerAlreadyExistsError from '../../../../presentation/errors/customer-already-exists-error'
import { AddCustomerRepository } from '../../../protocols/db/customer/add-customer-repository'
import { LoadCustomerByEmailRepository } from '../../../protocols/db/customer/load-customer-by-email-repository'

export class DbAddCustomer implements AddCustomer {
  constructor(
    private readonly addCustomerRepository: AddCustomerRepository,
    private readonly loadCustomerByEmailRepository: LoadCustomerByEmailRepository
  ) {}

  async add(customerData: AddCustomerModel): Promise<CustomerModel> {
    const doesCustomerExists = await this.loadCustomerByEmailRepository.loadByEmail(
      customerData.email
    )
    if (doesCustomerExists) {
      throw new CustomerAlreadyExistsError('Customer already exists')
    }
    const customer = await this.addCustomerRepository.add({
      ...customerData,
      favoriteProducts: []
    })
    return customer
  }
}
