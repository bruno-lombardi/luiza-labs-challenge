import { CustomerModel } from '../../models/customer'

export interface GetCustomer {
  getCustomerById: (customerId: string) => Promise<CustomerModel>
}
