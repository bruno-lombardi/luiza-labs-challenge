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
    const customer = await this.loadCustomerByTokenRepository.loadCustomerByToken(
      accessToken
    )
    return customer
  }
}
