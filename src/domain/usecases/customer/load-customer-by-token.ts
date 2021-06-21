import { CustomerModel } from '../../models/customer'

export interface LoadCustomerByToken {
  loadCustomer: (accessToken: string) => Promise<CustomerModel>
}
