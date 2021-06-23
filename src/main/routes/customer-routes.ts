import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddFavoriteProductController } from '../factories/customer/add-favorite-product-factory'
import { makeDeleteCustomerController } from '../factories/customer/delete-customer-factory'
import { makeGetCustomerController } from '../factories/customer/get-customer-factory'
import { makeRemoveFavoriteProductController } from '../factories/customer/remove-favorite-product-factory'
import { makeUpdateCustomerController } from '../factories/customer/update-customer-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  router.get(
    '/customers/:customerId',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeGetCustomerController())
  )
  router.put(
    '/customers/:customerId',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeUpdateCustomerController())
  )
  router.delete(
    '/customers/:customerId',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeDeleteCustomerController())
  )

  router.put(
    '/customers/:customerId/product/:productId',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeAddFavoriteProductController())
  )

  router.delete(
    '/customers/:customerId/product/:productId',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeRemoveFavoriteProductController())
  )
}
