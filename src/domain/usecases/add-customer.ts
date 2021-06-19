import { CustomerModel } from '../models/customer'

export interface AddCustomerModel {
  name: string
  email: string
}

export interface AddCustomer {
  add: (customer: AddCustomerModel) => Promise<CustomerModel>
}
