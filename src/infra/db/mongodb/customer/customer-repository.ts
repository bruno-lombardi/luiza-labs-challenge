import { AddCustomerRepository } from '../../../../data/protocols/db/customer/add-customer-repository'
import { LoadCustomerByEmailRepository } from '../../../../data/protocols/db/customer/load-customer-by-email-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../../../data/protocols/db/customer/update-access-token-repository'
import { CustomerModel } from '../../../../domain/models/customer'
import { AddCustomerModel } from '../../../../domain/usecases/add-customer'
import { mongoHelper } from '../helpers/mongo-helper'

export class CustomerMongoRepository
  implements
    AddCustomerRepository,
    LoadCustomerByEmailRepository,
    UpdateAccessTokenRepository {
  async add(customerData: AddCustomerModel): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const result = await customerCollection.insertOne(customerData)
    return mongoHelper.map<CustomerModel>(result.ops[0])
  }

  async loadByEmail(email: string): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const customer = await customerCollection.findOne({ email })
    return mongoHelper.map<CustomerModel>(customer)
  }

  async updateAccessToken(
    updateAccessTokenModel: UpdateAccessTokenModel
  ): Promise<void> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const { customerId, token } = updateAccessTokenModel
    await customerCollection.updateOne(
      { _id: customerId },
      { $set: { accessToken: token } }
    )
  }
}
