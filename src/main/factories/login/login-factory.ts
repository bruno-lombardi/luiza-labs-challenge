import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols/controller'
import jwt from '../../config/jwt'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const jwtAdapter = new JwtAdapter(jwt.jwtSecret)
  const customerMongoRepository = new CustomerMongoRepository()
  const dbAuthentication = new DbAuthentication(
    customerMongoRepository,
    jwtAdapter,
    customerMongoRepository
  )
  const loginController = new LoginController(
    makeLoginValidation(),
    dbAuthentication
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
