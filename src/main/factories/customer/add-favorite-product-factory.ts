import { DbAddFavoriteProduct } from '../../../data/usecases/customer/add-favorite-product/db-add-favorite-product'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { AxiosHttpClient } from '../../../infra/http/axios/http-client'
import { HttpProductsApi } from '../../../infra/http/axios/product/http-products-api'
import { AddFavoriteProductController } from '../../../presentation/controllers/customer/add-favorite-product-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeAddFavoriteProductValidation } from './add-favorite-product-validation-factory'
import productApiConfig from '../../config/product-api'

export const makeAddFavoriteProductController = (): Controller => {
  const customerMongoRepository = new CustomerMongoRepository()
  const httpClient = new AxiosHttpClient(productApiConfig.apiUrl)
  const productRepository = new HttpProductsApi(httpClient)
  const dbAddFavoriteProduct = new DbAddFavoriteProduct(
    productRepository,
    customerMongoRepository,
    customerMongoRepository
  )
  const addFavoriteProductController = new AddFavoriteProductController(
    makeAddFavoriteProductValidation(),
    dbAddFavoriteProduct
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(
    addFavoriteProductController,
    logMongoRepository
  )
}
