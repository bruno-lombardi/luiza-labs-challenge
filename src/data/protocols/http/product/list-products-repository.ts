import { PaginationResult } from '../../../../domain/models/pagination-result'
import { ProductModel } from '../../../../domain/models/product'
import { PaginationOptions } from '../../../../domain/usecases/product/list-products'

export interface ListProductsRepository {
  listProducts: (
    options: PaginationOptions
  ) => Promise<PaginationResult<ProductModel>>
}
