import { ProductModel } from '../../../domain/models/product'
import { GetProductByIdRepository } from '../../protocols/http/product/get-product-repository'
import { HttpGetProduct } from './http-get-product'

const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'any_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeGetProductByIdRepository = (): GetProductByIdRepository => {
  class GetProductByIdRepositoryStub implements GetProductByIdRepository {
    async getProductById(productId: string): Promise<ProductModel> {
      return await new Promise((resolve) => resolve(makeFakeProduct()))
    }
  }
  return new GetProductByIdRepositoryStub()
}

interface SutTypes {
  sut: HttpGetProduct
  getProductByIdRepositoryStub: GetProductByIdRepository
}

const makeSut = (): SutTypes => {
  const getProductByIdRepositoryStub = makeGetProductByIdRepository()

  const sut = new HttpGetProduct(getProductByIdRepositoryStub)

  return {
    sut,
    getProductByIdRepositoryStub
  }
}

describe('HttpGetProduct UseCase', () => {
  it('should call GetProductByIdRepository with correct product id', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    const getProductSpy = jest.spyOn(
      getProductByIdRepositoryStub,
      'getProductById'
    )
    await sut.getProductById('any_id')
    expect(getProductSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if GetProductByIdRepository throws', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    jest
      .spyOn(getProductByIdRepositoryStub, 'getProductById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.getProductById('any_id')
    expect(promise).rejects.toThrow()
  })

  it('should return null if GetProductByIdRepository returns null', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    jest
      .spyOn(getProductByIdRepositoryStub, 'getProductById')
      .mockReturnValueOnce(null)
    const product = await sut.getProductById('any_id')
    expect(product).toBe(null)
  })
})
