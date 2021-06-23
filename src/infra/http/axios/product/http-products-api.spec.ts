import {
  HttpClient,
  RequestConfig
} from '../../../../data/protocols/http/client/http-client'
import { PaginationResult } from '../../../../domain/models/pagination-result'
import { ProductModel } from '../../../../domain/models/product'
import { HttpProductsApi } from './http-products-api'

const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'any_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeFakeProductList = (): PaginationResult<ProductModel> => ({
  data: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()],
  page: 1,
  size: 3
})

const makeHttpClient = (): HttpClient => {
  class HttpClientStub implements HttpClient {
    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
      return await new Promise((resolve) => resolve({} as T))
    }
  }
  return new HttpClientStub()
}

interface SutTypes {
  httpClientStub: HttpClient
  sut: HttpProductsApi
}

const makeSut = (): SutTypes => {
  const httpClientStub = makeHttpClient()
  const sut = new HttpProductsApi(httpClientStub)
  return {
    sut,
    httpClientStub
  }
}

describe('HttpProductsApi', () => {
  describe('listProducts()', () => {
    it('should return a list of paginated products', async () => {
      const { sut, httpClientStub } = makeSut()
      jest
        .spyOn(httpClientStub, 'get')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(makeFakeProductList()))
        )
      const productsList = await sut.listProducts({ page: 1 })
      expect(productsList).toEqual(makeFakeProductList())
    })

    it('should call httpClient with correct params', async () => {
      const { sut, httpClientStub } = makeSut()
      const getSpy = jest.spyOn(httpClientStub, 'get')
      await sut.listProducts({ page: 1 })
      expect(getSpy).toHaveBeenCalledWith('/product/?page=1')
    })

    it('should throw if httpClient throws', async () => {
      const { sut, httpClientStub } = makeSut()
      jest.spyOn(httpClientStub, 'get').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.listProducts({ page: 1 })
      expect(promise).rejects.toThrow()
    })
  })

  describe('getProductById()', () => {
    it('should return a product when valid id', async () => {
      const { sut, httpClientStub } = makeSut()
      jest
        .spyOn(httpClientStub, 'get')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(makeFakeProduct()))
        )
      const productsList = await sut.getProductById('any_id')
      expect(productsList).toEqual(makeFakeProduct())
    })

    it('should call httpClient with correct params', async () => {
      const { sut, httpClientStub } = makeSut()
      const getSpy = jest.spyOn(httpClientStub, 'get')
      await sut.getProductById('any_id')
      expect(getSpy).toHaveBeenCalledWith('/product/any_id/')
    })

    it('should throw if httpClient throws', async () => {
      const { sut, httpClientStub } = makeSut()
      jest.spyOn(httpClientStub, 'get').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getProductById('any_id')
      expect(promise).rejects.toThrow()
    })
  })
})
