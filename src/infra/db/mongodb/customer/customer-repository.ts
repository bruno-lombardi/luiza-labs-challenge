import { ObjectID } from 'mongodb'
import { AddCustomerRepository } from '../../../../data/protocols/db/customer/add-customer-repository'
import { AddFavoriteProductRepository } from '../../../../data/protocols/db/customer/add-favorite-product-repository'
import { DeleteCustomerRepository } from '../../../../data/protocols/db/customer/delete-customer-repository'
import { FindCustomerFavoriteProductRepository } from '../../../../data/protocols/db/customer/find-customer-favorite-product-repository'
import { LoadCustomerByEmailRepository } from '../../../../data/protocols/db/customer/load-customer-by-email-repository'
import { LoadCustomerByIdRepository } from '../../../../data/protocols/db/customer/load-customer-by-id-repository'
import { LoadCustomerByTokenRepository } from '../../../../data/protocols/db/customer/load-customer-by-token-repository'
import { RemoveFavoriteProductRepository } from '../../../../data/protocols/db/customer/remove-favorite-product-repository'
import {
  UpdateAccessTokenModel,
  UpdateAccessTokenRepository
} from '../../../../data/protocols/db/customer/update-access-token-repository'
import { UpdateCustomerRepository } from '../../../../data/protocols/db/customer/update-customer-repository'
import { CustomerModel } from '../../../../domain/models/customer'
import { ProductModel } from '../../../../domain/models/product'
import { AddCustomerModel } from '../../../../domain/usecases/customer/add-customer'
import { UpdateCustomerModel } from '../../../../domain/usecases/customer/update-customer'
import { mongoHelper } from '../helpers/mongo-helper'

export class CustomerMongoRepository
  implements
    AddCustomerRepository,
    LoadCustomerByEmailRepository,
    LoadCustomerByIdRepository,
    LoadCustomerByTokenRepository,
    UpdateAccessTokenRepository,
    UpdateCustomerRepository,
    DeleteCustomerRepository,
    FindCustomerFavoriteProductRepository,
    AddFavoriteProductRepository,
    RemoveFavoriteProductRepository {
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
    const _id = new ObjectID(customerId)
    await customerCollection.updateOne(
      { _id },
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

  async loadCustomerByToken(accessToken: string): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const customer = await customerCollection.findOne({ accessToken })
    return mongoHelper.map<CustomerModel>(customer)
  }

  async findCustomerFavoriteProduct(
    productId: string,
    customerId: string
  ): Promise<ProductModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(customerId)

    const result = await customerCollection.findOne(
      {
        _id,
        'favoriteProducts.id': {
          $eq: productId
        }
      },
      {
        projection: { _id: 0, 'favoriteProducts.$': 1 }
      }
    )

    if (!result) {
      return null
    }

    const product = result.favoriteProducts[0]

    return mongoHelper.map<ProductModel>(product)
  }

  async addFavoriteProductToCustomer(
    product: ProductModel,
    customerId: string
  ): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(customerId)
    await customerCollection.updateOne(
      { _id },
      { $push: { favoriteProducts: product } }
    )
    const customer = await this.loadById(customerId)
    return customer
  }

  async removeFavoriteProductFromCustomer(
    productId: string,
    customerId: string
  ): Promise<CustomerModel> {
    const customerCollection = await mongoHelper.getCollection('customers')
    const _id = new ObjectID(customerId)
    await customerCollection.updateOne(
      { _id },
      { $pull: { favoriteProducts: { id: productId } } }
    )
    const customer = await this.loadById(customerId)
    return customer
  }
}
