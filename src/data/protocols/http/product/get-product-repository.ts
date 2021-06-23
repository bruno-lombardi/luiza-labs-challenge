import { ProductModel } from '../../../../domain/models/product'

export interface GetProductByIdRepository {
  getProductById: (productId: string) => Promise<ProductModel>
}
