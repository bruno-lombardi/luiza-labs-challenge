import { CustomerModel } from '../../../../domain/models/customer'

export interface LoadCustomerByEmailRepository {
  loadByEmail: (email: string) => Promise<CustomerModel>
}
