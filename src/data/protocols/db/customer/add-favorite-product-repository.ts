import { CustomerModel } from '../../../../domain/models/customer'
import { ProductModel } from '../../../../domain/models/product'

export interface AddFavoriteProductRepository {
  addFavoriteProductToCustomer: (
    product: ProductModel,
    customerId: string
  ) => Promise<CustomerModel>
}
