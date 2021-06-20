import { Collection, ObjectID } from 'mongodb'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { CustomerModel } from '../../domain/models/customer'

let customerCollection: Collection

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
      await request(app)
        .get(`/api/customers/${fakeCustomerId.toHexString()}`)
        .expect(200)
    })

    it('should return a customer on GET /customers/:customerId', async () => {
      const result = await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      const fakeCustomerId = result.insertedId as ObjectID
      await request(app)
        .get(`/api/customers/${fakeCustomerId.toHexString()}`)
        .then((res) => {
          const customer: CustomerModel = res.body
          expect(customer.id).toBe(fakeCustomerId.toHexString())
          expect(customer.name).toBe('Bruno')
          expect(customer.email).toBe('bruno@kuppi.com.br')
        })
    })

    it('should return 400 on GET /customers/:customerId when customer id is not valid object id', async () => {
      await request(app).get(`/api/customers/any_id`).expect(400)
    })

    it('should return 404 on GET /customers/:customerId when customer id is not found', async () => {
      const fakeId = new ObjectID().toHexString()
      await request(app).get(`/api/customers/${fakeId}`).expect(404)
    })
  })
})
