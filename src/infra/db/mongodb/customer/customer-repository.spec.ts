import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { CustomerMongoRepository } from './customer-repository'

let customerCollection: Collection

describe('CustomerMongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env?.MONGO_URL)
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    customerCollection = await mongoHelper.getCollection('customers')
    await customerCollection.deleteMany({})
  })

  const makeSut = (): CustomerMongoRepository => new CustomerMongoRepository()

  it('should insert and return an customer successfully', async () => {
    const sut = makeSut()
    const customer = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com'
    })
    expect(customer).toBeTruthy()
    expect(customer.id).toBeTruthy()
    expect(customer.name).toBe('any_name')
    expect(customer.email).toBe('any_email@email.com')
  })

  it('should return an customer on loadByEmail success', async () => {
    const sut = makeSut()
    await customerCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com'
    })
    const customer = await sut.loadByEmail('any_email@email.com')
    expect(customer).toBeTruthy()
    expect(customer.id).toBeTruthy()
    expect(customer.name).toBe('any_name')
    expect(customer.email).toBe('any_email@email.com')
  })

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const customer = await sut.loadByEmail('any_email@email.com')
    expect(customer).toBeFalsy()
  })

  it('should update the customer access token when updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await customerCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com'
    })
    const fakeCustomer = result.ops[0]
    expect(fakeCustomer.accessToken).toBeFalsy()
    await sut.updateAccessToken({
      customerId: fakeCustomer._id,
      token: 'any_token'
    })
    const customer = await customerCollection.findOne({
      _id: fakeCustomer._id
    })
    expect(customer).toBeTruthy()
    expect(customer.accessToken).toBeTruthy()
  })
})
