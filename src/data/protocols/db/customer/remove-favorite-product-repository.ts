import { CustomerModel } from '../../../../domain/models/customer'

export interface RemoveFavoriteProductRepository {
  removeFavoriteProductFromCustomer: (
    productId: string,
    customerId: string
  ) => Promise<CustomerModel>
}
