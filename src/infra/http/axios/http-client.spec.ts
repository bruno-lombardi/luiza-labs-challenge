import axios from 'axios'
import { AxiosHttpClient } from './http-client'

const baseUrl = 'base_url'
const sut = new AxiosHttpClient(baseUrl)

jest.mock('axios', () => ({
  async get(endpoint: string): Promise<any> {
    return await new Promise((resolve) =>
      resolve({ status: 200, data: { id: 'any_id' } })
    )
  }
}))

describe('Http Helper', () => {
  describe('get()', () => {
    it('should call axios get method with correct params', async () => {
      const getSpy = jest.spyOn(axios, 'get')
      await sut.get('/url', {})
      expect(getSpy).toHaveBeenCalledWith(`${baseUrl}/url`, {})
    })

    it('should get response data when calling get method', async () => {
      const response = await sut.get('/url', {})
      expect(response).toEqual({ id: 'any_id' })
    })

    it('should return null if request fails with 404', async () => {
      jest.spyOn(axios, 'get').mockImplementationOnce(() => {
        const error = new Error()
        Object.assign(error, { response: { status: 404 } })
        throw error
      })
      const response = await sut.get('/url', {})
      expect(response).toEqual(null)
    })

    it('should throw if request fails (status > 300)', async () => {
      jest.spyOn(axios, 'get').mockImplementationOnce(() => {
        const error = new Error()
        Object.assign(error, { response: { status: 500 } })
        throw error
      })
      const promise = sut.get('/url', {})
      expect(promise).rejects.toThrow()
    })
  })
})
