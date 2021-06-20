import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeGetCustomerController } from '../factories/customer/get-customer-factory'

export default (router: Router): void => {
  router.get('/customers/:customerId', adaptRoute(makeGetCustomerController()))
}
