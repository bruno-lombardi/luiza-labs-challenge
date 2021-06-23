import { ProductModel } from '../../../domain/models/product'
import { GetProduct } from '../../../domain/usecases/product/get-product'
import { GetProductByIdRepository } from '../../protocols/http/product/get-product-repository'

export class HttpGetProduct implements GetProduct {
  constructor(
    private readonly getProductByIdRepository: GetProductByIdRepository
  ) {}

  async getProductById(productId: string): Promise<ProductModel> {
    const product = await this.getProductByIdRepository.getProductById(
      productId
    )
    return product
  }
}
