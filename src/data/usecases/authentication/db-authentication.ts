import {
  Authentication,
  AuthParams
} from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { LoadCustomerByEmailRepository } from '../../protocols/db/customer/load-customer-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/customer/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadCustomerByEmailRepository: LoadCustomerByEmailRepository,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authenticationParams: AuthParams): Promise<string> {
    const customer = await this.loadCustomerByEmailRepository.loadByEmail(
      authenticationParams.email
    )
    if (customer) {
      const accessToken = await this.encrypter.encrypt(customer.id)
      await this.updateAccessTokenRepository.updateAccessToken({
        customerId: customer.id,
        token: accessToken
      })
      return accessToken
    }
    return null
  }
}
