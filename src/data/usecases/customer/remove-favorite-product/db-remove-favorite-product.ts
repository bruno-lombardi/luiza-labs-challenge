import { CustomerModel } from '../../../../domain/models/customer'
import { RemoveFavoriteProduct } from '../../../../domain/usecases/customer/remove-favorite-product'
import ProductNotFoundError from '../../../../presentation/errors/product-not-found-error'
import { FindCustomerFavoriteProductRepository } from '../../../protocols/db/customer/find-customer-favorite-product-repository'
import { RemoveFavoriteProductRepository } from '../../../protocols/db/customer/remove-favorite-product-repository'

export class DbRemoveFavoriteProduct implements RemoveFavoriteProduct {
  constructor(
    private readonly removeFavoriteProductRepository: RemoveFavoriteProductRepository,
    private readonly findCustomerFavoriteProductRepository: FindCustomerFavoriteProductRepository
  ) {}

  async removeFavoriteProductFromCustomer(
    productId: string,
    customerId: string
  ): Promise<CustomerModel> {
    const hasCustomerAddedThisProduct = await this.findCustomerFavoriteProductRepository.findCustomerFavoriteProduct(
      productId,
      customerId
    )

    if (!hasCustomerAddedThisProduct) {
      throw new ProductNotFoundError('This product was not found')
    }

    const customer = await this.removeFavoriteProductRepository.removeFavoriteProductFromCustomer(
      productId,
      customerId
    )
    return customer
  }
}
