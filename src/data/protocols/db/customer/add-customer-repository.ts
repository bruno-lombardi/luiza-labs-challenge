import { CustomerModel } from '../../../../domain/models/customer'
import { AddCustomerModel } from '../../../../domain/usecases/add-customer'

export interface AddCustomerRepository {
  add: (customer: AddCustomerModel) => Promise<CustomerModel>
}
