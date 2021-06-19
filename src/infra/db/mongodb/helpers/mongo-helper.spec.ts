import { mongoHelper } from './mongo-helper'

const sut = mongoHelper

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env?.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  it('should reconnect if MongoDB is down', async () => {
    let customerCollection = await sut.getCollection('customers')
    expect(customerCollection).toBeTruthy()
    await sut.disconnect()
    customerCollection = await sut.getCollection('customers')
    expect(customerCollection).toBeTruthy()
  })
})
