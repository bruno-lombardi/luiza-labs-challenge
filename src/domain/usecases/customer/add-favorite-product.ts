import { CustomerModel } from '../../models/customer'

export interface AddFavoriteProduct {
  addFavoriteProductToCustomer: (
    productId: string,
    customerId: string
  ) => Promise<CustomerModel>
}
