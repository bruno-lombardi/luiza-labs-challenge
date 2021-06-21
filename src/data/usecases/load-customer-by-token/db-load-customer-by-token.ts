import { CustomerModel } from '../../../domain/models/customer'
import { LoadCustomerByToken } from '../../../domain/usecases/customer/load-customer-by-token'
import { Decrypter } from '../../protocols/crypto/decrypter'
import { LoadCustomerByTokenRepository } from '../../protocols/db/customer/load-customer-by-token-repository'

export class DbLoadCustomerByToken implements LoadCustomerByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadCustomerByTokenRepository: LoadCustomerByTokenRepository
  ) {}

  async loadCustomer(accessToken: string): Promise<CustomerModel> {
    let isTokenVerified: string
    try {
      isTokenVerified = await this.decrypter.decrypt(accessToken)
    } catch (err) {
      return null
    }
    if (isTokenVerified) {
      const customer = await this.loadCustomerByTokenRepository.loadCustomerByToken(
        accessToken
      )
      return customer
    }
    return null
  }
}
