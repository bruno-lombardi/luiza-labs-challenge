import { CustomerModel } from '../../../../domain/models/customer'
import { AddCustomerModel } from '../../../../domain/usecases/customer/add-customer'

export interface AddCustomerRepository {
  add: (customer: AddCustomerModel) => Promise<CustomerModel>
}
