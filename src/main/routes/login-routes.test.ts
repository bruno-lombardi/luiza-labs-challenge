import { Collection } from 'mongodb'
import request from 'supertest'
import { CustomerModel } from '../../domain/models/customer'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let customerCollection: Collection

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    it('should return 200 on POST /api/signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Bruno',
          email: 'bruno@kuppi.com.br',
          email_confirmation: 'bruno@kuppi.com.br'
        })
        .expect(200)
    })
    it('should return an customer on POST /api/signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Bruno',
          email: 'bruno@kuppi.com.br',
          email_confirmation: 'bruno@kuppi.com.br'
        })
        .expect(200)
        .then((res) => {
          const customer: CustomerModel = res.body
          expect(customer.id).toBeTruthy()
          expect(customer.name).toBe('Bruno')
          expect(customer.email).toBe('bruno@kuppi.com.br')
        })
    })
  })
  describe('POST /login', () => {
    it('should return 200 on POST /api/login', async () => {
      await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@kuppi.com.br'
        })
        .expect(200)
    })
    it('should return 401 on POST /api/login with invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@kuppi.com.br'
        })
        .expect(401)
    })
    it('should return an access token on POST /api/login', async () => {
      await customerCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@kuppi.com.br'
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@kuppi.com.br'
        })
        .expect(200)
        .then((res) => {
          const accessToken = res.body.accessToken
          expect(accessToken).toBeTruthy()
        })
    })
  })
})
