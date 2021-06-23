import { ProductModel } from '../../../../domain/models/product'

export interface FindCustomerFavoriteProductRepository {
  findCustomerFavoriteProduct: (
    productId: string,
    customerId: string
  ) => Promise<ProductModel>
}
