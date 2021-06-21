import { DbLoadCustomerByToken } from '../../../data/usecases/load-customer-by-token/db-load-customer-by-token'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { CustomerMongoRepository } from '../../../infra/db/mongodb/customer/customer-repository'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { Middleware } from '../../../presentation/protocols/middleware'
import jwt from '../../config/jwt'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const jwtAdapter = new JwtAdapter(jwt.jwtSecret)
  const accountMongoRepository = new CustomerMongoRepository()
  const loadCustomerByToken = new DbLoadCustomerByToken(
    jwtAdapter,
    accountMongoRepository
  )
  return new AuthMiddleware(loadCustomerByToken)
}
