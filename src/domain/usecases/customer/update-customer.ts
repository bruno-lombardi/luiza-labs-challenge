import { CustomerModel } from '../../models/customer'

export interface UpdateCustomerModel {
  id: string
  name: string
  email: string
}

export interface UpdateCustomer {
  updateCustomer: (
    updateCustomerModel: UpdateCustomerModel
  ) => Promise<CustomerModel>
}
