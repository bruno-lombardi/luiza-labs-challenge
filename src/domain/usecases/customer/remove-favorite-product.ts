import { CustomerModel } from '../../models/customer'

export interface RemoveFavoriteProduct {
  removeFavoriteProductFromCustomer: (
    productId: string,
    customerId: string
  ) => Promise<CustomerModel>
}
