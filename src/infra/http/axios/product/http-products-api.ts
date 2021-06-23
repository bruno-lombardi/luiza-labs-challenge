import { HttpClient } from '../../../../data/protocols/http/client/http-client'
import { GetProductByIdRepository } from '../../../../data/protocols/http/product/get-product-repository'
import { ListProductsRepository } from '../../../../data/protocols/http/product/list-products-repository'
import { PaginationResult } from '../../../../domain/models/pagination-result'
import { ProductModel } from '../../../../domain/models/product'
import { PaginationOptions } from '../../../../domain/usecases/product/list-products'

export class HttpProductsApi
  implements GetProductByIdRepository, ListProductsRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async listProducts(
    options: PaginationOptions
  ): Promise<PaginationResult<ProductModel>> {
    return await this.httpClient.get<PaginationResult<ProductModel>>(
      `/product/?page=${options.page}`
    )
  }

  async getProductById(productId: string): Promise<ProductModel> {
    return await this.httpClient.get<ProductModel>(`/product/${productId}/`)
  }
}
