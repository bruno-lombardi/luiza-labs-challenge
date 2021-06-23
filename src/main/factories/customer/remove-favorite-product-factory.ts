import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeAddFavoriteProductValidation } from './add-favorite-product-validation-factory'
import { RemoveFavoriteProductController } from '../../../presentation/controllers/customer/remove-favorite-product-controller'
import { DbRemoveFavoriteProduct } from '../../../data/usecases/customer/remove-favorite-product/db-remove-favorite-product'

export const makeRemoveFavoriteProductController = (): Controller => {
  const customerMongoRepository = new CustomerMongoRepository()
  const dbRemoveFavoriteProduct = new DbRemoveFavoriteProduct(
    customerMongoRepository,
    customerMongoRepository
  )
  const removeFavoriteController = new RemoveFavoriteProductController(
    makeAddFavoriteProductValidation(),
    dbRemoveFavoriteProduct
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(
    removeFavoriteController,
    logMongoRepository
  )
}
