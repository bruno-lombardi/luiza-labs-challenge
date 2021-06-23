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

  describe('loadCustomerByToken', () => {
    it('should delete the customer if the id provided exists', async () => {
      const sut = makeSut()
      await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token'
      })
      const customer = await sut.loadCustomerByToken('any_token')
      expect(customer).toBeTruthy()
    })

    it('should return null if id provided does not exists', async () => {
      const sut = makeSut()
      const customer = await sut.loadCustomerByToken('invalid_token')
      expect(customer).toBeFalsy()
    })
  })

  describe('findCustomerFavoriteProduct', () => {
    it('should return the product model if it exists in favorite products', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token',
        favoriteProducts: [
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_01',
            title: 'any_title1',
            reviewScore: 4.0
          },
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_02',
            title: 'any_title2',
            reviewScore: 4.0
          }
        ]
      })
      const fakeCustomerId = result.insertedId
      const product = await sut.findCustomerFavoriteProduct(
        'product_01',
        fakeCustomerId
      )
      expect(product).toEqual({
        price: 999.0,
        image: 'any_image_url',
        brand: 'any_brand',
        id: 'product_01',
        title: 'any_title1',
        reviewScore: 4.0
      })

      const product2 = await sut.findCustomerFavoriteProduct(
        'product_02',
        fakeCustomerId
      )
      expect(product2).toEqual({
        price: 999.0,
        image: 'any_image_url',
        brand: 'any_brand',
        id: 'product_02',
        title: 'any_title2',
        reviewScore: 4.0
      })
    })

    it('should return null if product id provided does not exists', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token',
        favoriteProducts: [
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_01',
            title: 'any_title1',
            reviewScore: 4.0
          },
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_02',
            title: 'any_title2',
            reviewScore: 4.0
          }
        ]
      })
      const fakeCustomerId = result.insertedId
      const product = await sut.findCustomerFavoriteProduct(
        'product_03',
        fakeCustomerId
      )
      expect(product).toBeFalsy()
    })

    it('should return null if customer id provided does not exists', async () => {
      const sut = makeSut()
      const fakeCustomerId = new ObjectID().toHexString()
      const product = await sut.findCustomerFavoriteProduct(
        'product_03',
        fakeCustomerId
      )
      expect(product).toBeFalsy()
    })
  })

  describe('addFavoriteProductToCustomer', () => {
    it('should return the updated customer if valid customer id', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token'
      })
      const fakeCustomerId = result.insertedId
      const customer = await sut.addFavoriteProductToCustomer(
        {
          price: 999.0,
          image: 'any_image_url',
          brand: 'any_brand',
          id: 'product_01',
          title: 'any_title1',
          reviewScore: 4.0
        },
        fakeCustomerId
      )
      expect(customer).toBeTruthy()
      expect(customer.favoriteProducts.length).toBe(1)
      expect(customer.favoriteProducts[0]).toEqual({
        price: 999.0,
        image: 'any_image_url',
        brand: 'any_brand',
        id: 'product_01',
        title: 'any_title1',
        reviewScore: 4.0
      })
    })

    it('should return null if customer id provided does not exists', async () => {
      const sut = makeSut()
      const fakeCustomerId = new ObjectID().toHexString()
      const customer = await sut.addFavoriteProductToCustomer(
        {
          price: 999.0,
          image: 'any_image_url',
          brand: 'any_brand',
          id: 'product_01',
          title: 'any_title1',
          reviewScore: 4.0
        },
        fakeCustomerId
      )
      expect(customer).toBeFalsy()
    })
  })

  describe('removeFavoriteProductFromCustomer', () => {
    it('should remove the favorited product from customer when valid customer and product id', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token',
        favoriteProducts: [
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_01',
            title: 'any_title1',
            reviewScore: 4.0
          },
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_02',
            title: 'any_title2',
            reviewScore: 4.0
          }
        ]
      })
      const fakeCustomerId = result.insertedId
      const customer = await sut.removeFavoriteProductFromCustomer(
        'product_02',
        fakeCustomerId
      )
      expect(customer).toBeTruthy()
      expect(customer.favoriteProducts.length).toBe(1)
      expect(customer.favoriteProducts[0]).toEqual({
        price: 999.0,
        image: 'any_image_url',
        brand: 'any_brand',
        id: 'product_01',
        title: 'any_title1',
        reviewScore: 4.0
      })
    })

    it('should return found customer if product id provided does not exists', async () => {
      const sut = makeSut()
      const result = await customerCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        accessToken: 'any_token',
        favoriteProducts: [
          {
            price: 999.0,
            image: 'any_image_url',
            brand: 'any_brand',
            id: 'product_01',
            title: 'any_title1',
            reviewScore: 4.0
          }
        ]
      })
      const fakeCustomerId = result.insertedId
      const customer = await sut.removeFavoriteProductFromCustomer(
        'product_02',
        fakeCustomerId
      )
      expect(customer).toBeTruthy()
      expect(customer.favoriteProducts.length).toBe(1)
      expect(customer.favoriteProducts[0]).toEqual({
        price: 999.0,
        image: 'any_image_url',
        brand: 'any_brand',
        id: 'product_01',
        title: 'any_title1',
        reviewScore: 4.0
      })
    })

    it('should return null if customer id provided does not exists', async () => {
      const sut = makeSut()
      const fakeCustomerId = new ObjectID().toHexString()
      const customer = await sut.removeFavoriteProductFromCustomer(
        'product_01',
        fakeCustomerId
      )
      expect(customer).toBeFalsy()
    })
  })
})
