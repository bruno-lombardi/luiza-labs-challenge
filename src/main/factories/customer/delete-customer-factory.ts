import { DbDeleteCustomer } from '../../../data/usecases/customer/delete-customer/db-delete-customer'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { DeleteCustomerController } from '../../../presentation/controllers/customer/delete-customer-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeDeleteCustomerValidation } from './delete-customer-validation-factory'

export const makeDeleteCustomerController = (): Controller => {
  const customerMongoRepository = new CustomerMongoRepository()
  const dbDeleteCustomer = new DbDeleteCustomer(customerMongoRepository)
  const deleteCustomerController = new DeleteCustomerController(
    makeDeleteCustomerValidation(),
    dbDeleteCustomer
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(
    deleteCustomerController,
    logMongoRepository
  )
}
