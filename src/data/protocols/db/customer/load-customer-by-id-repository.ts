import { CustomerModel } from '../../../../domain/models/customer'

export interface LoadCustomerByIdRepository {
  loadById: (customerId: string) => Promise<CustomerModel>
}
