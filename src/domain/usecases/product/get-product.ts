import { ProductModel } from '../../models/product'

export interface GetProduct {
  getProductById: (productId: string) => Promise<ProductModel>
}
