import { ObjectID } from 'mongodb'
import { AddCustomerRepository } from '../../../../data/protocols/db/customer/add-customer-repository'
import { DeleteCustomerRepository } from '../../../../data/protocols/db/customer/delete-customer-repository'
import { LoadCustomerByEmailRepository } from '../../../../data/protocols/db/customer/load-customer-by-email-repository'
import { LoadCustomerByIdRepository } from '../../../../data/protocols/db/customer/load-customer-by-id-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../../../data/protocols/db/customer/update-access-token-repository'
import { UpdateCustomerRepository } from '../../../../data/protocols/db/customer/update-customer-repository'
import { CustomerModel } from '../../../../domain/models/customer'
import { AddCustomerModel } from '../../../../domain/usecases/customer/add-customer'
import { UpdateCustomerModel } from '../../../../domain/usecases/customer/update-customer'
import { mongoHelper } from '../helpers/mongo-helper'

export class CustomerMongoRepository
  implements
    AddCustomerRepository,
    LoadCustomerByEmailRepository,
    LoadCustomerByIdRepository,
    UpdateAccessTokenRepository,
    UpdateCustomerRepository,
    DeleteCustomerRepository {
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

  async loadById(customerId: string): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(customerId)
    const customer = await customerCollection.findOne({ _id })
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

  async updateCustomer(
    updateCustomerModel: UpdateCustomerModel
  ): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(updateCustomerModel.id)

    await customerCollection.updateOne(
      { _id },
      {
        $set: {
          name: updateCustomerModel.name,
          email: updateCustomerModel.email
        }
      }
    )
    const customer = await this.loadById(updateCustomerModel.id)
    return customer
  }

  async deleteCustomerById(customerId: string): Promise<boolean> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(customerId)

    const result = await customerCollection.deleteOne({
      _id
    })
    return result.deletedCount > 0
  }
}
