import { DbUpdateCustomer } from '../../../data/usecases/update-customer/db-update-costumer'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { UpdateCustomerController } from '../../../presentation/controllers/customer/update-customer-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeUpdateCustomerValidation } from './update-customer-validation-factory'

export const makeUpdateCustomerController = (): Controller => {
  const customerMongoRepository = new CustomerMongoRepository()
  const dbUpdateCustomer = new DbUpdateCustomer(customerMongoRepository)
  const getCustomerController = new UpdateCustomerController(
    makeUpdateCustomerValidation(),
    dbUpdateCustomer
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(getCustomerController, logMongoRepository)
}
