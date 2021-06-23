import { DbAddCustomer } from '../../../data/usecases/customer/add-customer/db-add-customer'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { SignUpController } from '../../../presentation/controllers/signup/sign-up-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const customerRepository = new CustomerMongoRepository()
  const dbAddCustomer = new DbAddCustomer(customerRepository)
  const signUpController = new SignUpController(
    dbAddCustomer,
    makeSignUpValidation()
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
