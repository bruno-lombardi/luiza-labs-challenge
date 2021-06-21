import { CustomerModel } from '../../../../domain/models/customer'

export interface LoadCustomerByTokenRepository {
  loadCustomerByToken: (accessToken: string) => Promise<CustomerModel>
}
