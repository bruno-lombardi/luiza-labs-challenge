import { CustomerModel } from '../../../../domain/models/customer'
import { AddFavoriteProduct } from '../../../../domain/usecases/customer/add-favorite-product'
import ProductAlreadyFavoritedError from '../../../../presentation/errors/product-already-favorited-error'
import ProductNotFoundError from '../../../../presentation/errors/product-not-found-error'
import { AddFavoriteProductRepository } from '../../../protocols/db/customer/add-favorite-product-repository'
import { FindCustomerFavoriteProductRepository } from '../../../protocols/db/customer/find-customer-favorite-product-repository'
import { GetProductByIdRepository } from '../../../protocols/http/product/get-product-repository'

export class DbAddFavoriteProduct implements AddFavoriteProduct {
  constructor(
    private readonly getProductByIdRepository: GetProductByIdRepository,
    private readonly addFavoriteProductRepository: AddFavoriteProductRepository,
    private readonly findCustomerFavoriteProductRepository: FindCustomerFavoriteProductRepository
  ) {}

  async addFavoriteProductToCustomer(
    productId: string,
    customerId: string
  ): Promise<CustomerModel> {
    const product = await this.getProductByIdRepository.getProductById(
      productId
    )

    if (!product) {
      throw new ProductNotFoundError('This product was not found')
    }

    const hasCustomerAddedThisProduct = await this.findCustomerFavoriteProductRepository.findCustomerFavoriteProduct(
      productId,
      customerId
    )

    if (hasCustomerAddedThisProduct) {
      throw new ProductAlreadyFavoritedError(
        'This customer already favorited this product'
      )
    }

    const customer = await this.addFavoriteProductRepository.addFavoriteProductToCustomer(
      product,
      customerId
    )
    return customer
  }
}
