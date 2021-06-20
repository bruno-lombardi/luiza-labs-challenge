import { Collection, ObjectID } from 'mongodb'
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

  describe('add', () => {
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
  })

  describe('loadByEmail', () => {
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
  })

  describe('updateAccessToken', () => {
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

  describe('loadById', () => {
    it('should get the customer if the id provided exists', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com'
      })
      const fakeCustomerId = result.insertedId
      const customer = await sut.loadById(fakeCustomerId)
      expect(customer.id).toBeTruthy()
      expect(customer.name).toBe('any_name')
      expect(customer.email).toBe('any_email@email.com')
    })
    it('should return null if id provided does not exists', async () => {
      const sut = makeSut()
      const customer = await sut.loadById(new ObjectID().toHexString())
      expect(customer).toBeFalsy()
    })
  })

  describe('updateCustomer', () => {
    it('should update the customer data if the id provided exists', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const updateData = {
        id: fakeCustomerId.toHexString(),
        name: 'new_name',
        email: 'new_email@email.com'
      }
      const customer = await sut.updateCustomer(updateData)
      expect(customer.id).toBeTruthy()
      expect(customer.name).toBe('new_name')
      expect(customer.email).toBe('new_email@email.com')
    })

    it('should return null if id provided does not exists', async () => {
      const sut = makeSut()
      const updateData = {
        id: new ObjectID().toHexString(),
        name: 'new_name',
        email: 'new_email@email.com'
      }
      const customer = await sut.updateCustomer(updateData)
      expect(customer).toBeFalsy()
    })
  })

  describe('deleteCustomerById', () => {
    it('should delete the customer if the id provided exists', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com'
      })
      const fakeCustomerId = result.insertedId as ObjectID

      const isDeleted = await sut.deleteCustomerById(
        fakeCustomerId.toHexString()
      )
      expect(isDeleted).toBeTruthy()
    })

    it('should return null if id provided does not exists', async () => {
      const sut = makeSut()
      const customer = await sut.deleteCustomerById(
        new ObjectID().toHexString()
      )
      expect(customer).toBeFalsy()
    })
  })
})
