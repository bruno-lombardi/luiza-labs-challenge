import { DbGetCustomer } from '../../../data/usecases/get-customer/db-get-customer'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { GetCustomerController } from '../../../presentation/controllers/customer/get-customer-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeGetCustomerValidation } from './get-customer-validation-factory'

export const makeGetCustomerController = (): Controller => {
  const customerMongoRepository = new CustomerMongoRepository()
  const dbGetCustomer = new DbGetCustomer(customerMongoRepository)
  const getCustomerController = new GetCustomerController(
    makeGetCustomerValidation(),
    dbGetCustomer
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(getCustomerController, logMongoRepository)
}
