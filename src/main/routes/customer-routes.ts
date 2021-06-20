import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeDeleteCustomerController } from '../factories/customer/delete-customer-factory'
import { makeGetCustomerController } from '../factories/customer/get-customer-factory'
import { makeUpdateCustomerController } from '../factories/customer/update-customer-factory'

export default (router: Router): void => {
  router.get('/customers/:customerId', adaptRoute(makeGetCustomerController()))
  router.put(
    '/customers/:customerId',
    adaptRoute(makeUpdateCustomerController())
  )
  router.delete(
    '/customers/:customerId',
    adaptRoute(makeDeleteCustomerController())
  )
}
