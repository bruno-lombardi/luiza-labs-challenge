import { PaginationResult } from '../../models/pagination-result'
import { ProductModel } from '../../models/product'

export interface PaginationOptions {
  page: number
}

export interface ListProducts {
  listProducts: (
    options: PaginationOptions
  ) => Promise<PaginationResult<ProductModel>>
}
