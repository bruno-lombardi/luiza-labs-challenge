import { Collection, ObjectID } from 'mongodb'
import axios from 'axios'

import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { CustomerModel } from '../../domain/models/customer'
import { sign } from 'jsonwebtoken'
import jwtConfig from '../config/jwt'
import { ProductModel } from '../../domain/models/product'

let customerCollection: Collection

const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'product_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeValidAccessToken = async (userId: ObjectID): Promise<string> => {
  const accessToken = sign({ id: userId.toHexString() }, jwtConfig.jwtSecret)
  await customerCollection.updateOne(
    {
      _id: userId
    },
    {
      $set: {
        accessToken
      }
    }
  )
  return `Bearer ${accessToken}`
}
// Mock axios response to return valid product

describe('Customer Routes', () => {
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

  describe('GET /customers/:customerId', () => {
    it('should return 200 on GET /customers/:customerId with valid customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)
      await request(app)
        .get(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(200)
    })

    it('should return a customer on GET /customers/:customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)
      await request(app)
        .get(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(200)
        .then((res) => {
          const customer: CustomerModel = res.body
          expect(customer.id).toBe(fakeCustomerId.toHexString())
          expect(customer.name).toBe('Bruno')
          expect(customer.email).toBe('bruno@kuppi.com.br')
        })
    })

    it('should return 401 on GET /customers/:customerId without authorization header', async () => {
      const fakeId = new ObjectID().toHexString()
      await request(app).get(`/api/customers/${fakeId}`).expect(401)
    })

    it('should return 403 on GET /customers/:customerId when access token does not belongs to customer', async () => {
      const anotherCustomerResult = await customerCollection.insertOne({
        name: 'Ana',
        email: 'ana@kuppi.com.br'
      })
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const anotherCustomerId = anotherCustomerResult.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .get(`/api/customers/${anotherCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(403)
    })
  })

  describe('PUT /customers/:customerId', () => {
    it('should return 200 on PUT /customers/:customerId with valid customerId and data', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .send({
          name: 'Ana',
          email: 'ana@kuppi.com.br'
        })
        .expect(200)
    })

    it('should return a customer on PUT /customers/:customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .send({
          name: 'Ana',
          email: 'ana@kuppi.com.br'
        })
        .expect(200)
        .then((res) => {
          const customer: CustomerModel = res.body
          expect(customer.id).toBe(fakeCustomerId.toHexString())
          expect(customer.name).toBe('Ana')
          expect(customer.email).toBe('ana@kuppi.com.br')
        })
    })

    it('should return 403 on PUT /customers/:customerId when access token that belongs to other user', async () => {
      const anotherCustomerResult = await customerCollection.insertOne({
        name: 'Ana',
        email: 'ana@kuppi.com.br'
      })
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const anotherCustomerId = anotherCustomerResult.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(`/api/customers/${anotherCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .send({
          name: 'Ana',
          email: 'ana@kuppi.com.br'
        })
        .expect(403)
    })
  })

  describe('DELETE /customers/:customerId', () => {
    it('should return 204 on DELETE /customers/:customerId with valid customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .delete(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(204)
    })

    it('should return empty response on DELETE /customers/:customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .delete(`/api/customers/${fakeCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(204)
        .then((res) => {
          expect(Object.keys(res.body).length).toBeFalsy()
        })
    })

    it('should return 401 on DELETE /customers/:customerId without authorization', async () => {
      const fakeId = new ObjectID().toHexString()
      await request(app).delete(`/api/customers/${fakeId}`).expect(401)
    })

    it('should return 403 on DELETE /customers/:customerId when customer id is not found', async () => {
      const anotherCustomerResult = await customerCollection.insertOne({
        name: 'Ana',
        email: 'ana@kuppi.com.br'
      })
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const anotherCustomerId = anotherCustomerResult.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .delete(`/api/customers/${anotherCustomerId.toHexString()}`)
        .set('authorization', accessToken)
        .expect(403)
    })
  })

  describe('PUT /customers/:customerId/product/:productId', () => {
    it('should return 200 on PUT /customers/:customerId/product/:productId with valid customerId and productId', async () => {
      const spy = jest.spyOn(axios, 'get').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            status: 200,
            data: makeFakeProduct()
          })
        )
      )

      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(
          `/api/customers/${fakeCustomerId.toHexString()}/product/product_id`
        )
        .set('authorization', accessToken)
        .expect(200)
      spy.mockRestore()
    })

    it('should return a customer with favorite product on PUT /customers/:customerId/product/:productId with valid customerId and productId', async () => {
      const spy = jest.spyOn(axios, 'get').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            status: 200,
            data: makeFakeProduct()
          })
        )
      )

      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(
          `/api/customers/${fakeCustomerId.toHexString()}/product/product_id`
        )
        .set('authorization', accessToken)
        .expect(200)
        .then((res) => {
          const customer = res.body as CustomerModel
          expect(customer.id).toBe(fakeCustomerId.toHexString())
          expect(customer.favoriteProducts.length).toBe(1)
          expect(customer.favoriteProducts[0]).toEqual(makeFakeProduct())
        })
      spy.mockRestore()
    })

    it('should return 403 on PUT /customers/:customerId/product/:productId when access token that belongs to other user', async () => {
      const spy = jest.spyOn(axios, 'get').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            status: 200,
            data: makeFakeProduct()
          })
        )
      )
      const anotherCustomerResult = await customerCollection.insertOne({
        name: 'Ana',
        email: 'ana@kuppi.com.br'
      })
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const anotherCustomerId = anotherCustomerResult.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(anotherCustomerId)

      await request(app)
        .put(
          `/api/customers/${fakeCustomerId.toHexString()}/product/product_id`
        )
        .set('authorization', accessToken)
        .expect(403)
      spy.mockRestore()
    })

    it('should return 404 on PUT /customers/:customerId/product/:productId when product is not found', async () => {
      const spy = jest.spyOn(axios, 'get').mockImplementationOnce(() => {
        const error = new Error()
        console.log('erroring')
        Object.assign(error, { response: { status: 404 } })
        throw error
      })

      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      const accessToken = await makeValidAccessToken(fakeCustomerId)

      await request(app)
        .put(
          `/api/customers/${fakeCustomerId.toHexString()}/product/product_id`
        )
        .set('authorization', accessToken)
        .expect(404)
        .then((res) => {
          console.log(res.body)
        })
      spy.mockRestore()
    })
  })
})
