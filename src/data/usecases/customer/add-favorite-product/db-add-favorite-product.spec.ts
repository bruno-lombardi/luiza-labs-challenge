import { CustomerModel } from '../../../../domain/models/customer'
import { ProductModel } from '../../../../domain/models/product'
import { AddFavoriteProductRepository } from '../../../protocols/db/customer/add-favorite-product-repository'
import { FindCustomerFavoriteProductRepository } from '../../../protocols/db/customer/find-customer-favorite-product-repository'
import { GetProductByIdRepository } from '../../../protocols/http/product/get-product-repository'
import { DbAddFavoriteProduct } from './db-add-favorite-product'
const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'any_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeFakeCustomerWithProducts = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: [makeFakeProduct()]
})

const makeAddFavoriteProductRepository = (): AddFavoriteProductRepository => {
  class AddFavoriteProductRepositoryStub
    implements AddFavoriteProductRepository {
    async addFavoriteProductToCustomer(
      product: ProductModel,
      customerId: string
    ): Promise<CustomerModel> {
      return await new Promise((resolve) =>
        resolve(makeFakeCustomerWithProducts())
      )
    }
  }
  return new AddFavoriteProductRepositoryStub()
}

const makeGetProductByIdRepository = (): GetProductByIdRepository => {
  class GetProductByIdRepositoryStub implements GetProductByIdRepository {
    async getProductById(productId: string): Promise<ProductModel> {
      return await new Promise((resolve) => resolve(makeFakeProduct()))
    }
  }
  return new GetProductByIdRepositoryStub()
}

const makeFindCustomerFavoriteProductRepository = (): FindCustomerFavoriteProductRepository => {
  class FindCustomerFavoriteProductRepositoryStub
    implements FindCustomerFavoriteProductRepository {
    async findCustomerFavoriteProduct(
      productId: string,
      customerId: string
    ): Promise<ProductModel> {
      return await new Promise((resolve) => resolve(null))
    }
  }
  return new FindCustomerFavoriteProductRepositoryStub()
}

interface SutTypes {
  sut: DbAddFavoriteProduct
  addFavoriteProductRepositoryStub: AddFavoriteProductRepository
  getProductByIdRepositoryStub: GetProductByIdRepository
  findCustomerFavoriteProductRepositoryStub: FindCustomerFavoriteProductRepository
}

const makeSut = (): SutTypes => {
  const addFavoriteProductRepositoryStub = makeAddFavoriteProductRepository()
  const getProductByIdRepositoryStub = makeGetProductByIdRepository()
  const findCustomerFavoriteProductRepositoryStub = makeFindCustomerFavoriteProductRepository()
  const sut = new DbAddFavoriteProduct(
    getProductByIdRepositoryStub,
    addFavoriteProductRepositoryStub,
    findCustomerFavoriteProductRepositoryStub
  )
  return {
    sut,
    getProductByIdRepositoryStub,
    addFavoriteProductRepositoryStub,
    findCustomerFavoriteProductRepositoryStub
  }
}

describe('DbAddFavoriteProduct UseCase', () => {
  it('should call GetProductByIdRepository with product id', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    const getProductSpy = jest.spyOn(
      getProductByIdRepositoryStub,
      'getProductById'
    )
    await sut.addFavoriteProductToCustomer('product_id', 'customer_id')
    expect(getProductSpy).toHaveBeenCalledWith('product_id')
  })

  it('should throw if GetProductByIdRepository throws', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    jest
      .spyOn(getProductByIdRepositoryStub, 'getProductById')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.addFavoriteProductToCustomer(
      'product_id',
      'customer_id'
    )
    expect(promise).rejects.toThrow()
  })

  it('should return null if GetProductByIdRepository returns null', async () => {
    const { sut, getProductByIdRepositoryStub } = makeSut()
    jest
      .spyOn(getProductByIdRepositoryStub, 'getProductById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const customer = await sut.addFavoriteProductToCustomer(
      'product_id',
      'customer_id'
    )
    expect(customer).toBe(null)
  })

  it('should call FindCustomerFavoriteProductRepository with customer and product id', async () => {
    const { sut, findCustomerFavoriteProductRepositoryStub } = makeSut()
    const findCustomerFavoriteProductSpy = jest.spyOn(
      findCustomerFavoriteProductRepositoryStub,
      'findCustomerFavoriteProduct'
    )
    await sut.addFavoriteProductToCustomer('product_id', 'customer_id')
    expect(findCustomerFavoriteProductSpy).toHaveBeenCalledWith(
      'product_id',
      'customer_id'
    )
  })

  it('should throw error if FindCustomerFavoriteProductRepository returns a product (product already favorited by customer)', async () => {
    const { sut, findCustomerFavoriteProductRepositoryStub } = makeSut()
    jest
      .spyOn(
        findCustomerFavoriteProductRepositoryStub,
        'findCustomerFavoriteProduct'
      )
      .mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeProduct())))
    const promise = sut.addFavoriteProductToCustomer(
      'product_id',
      'customer_id'
    )
    expect(promise).rejects.toThrow(
      'This customer already favorited this product'
    )
  })

  it('should call AddFavoriteProductRepository with product found and with client', async () => {
    const { sut, addFavoriteProductRepositoryStub } = makeSut()
    const addFavoriteProductSpy = jest.spyOn(
      addFavoriteProductRepositoryStub,
      'addFavoriteProductToCustomer'
    )
    await sut.addFavoriteProductToCustomer('product_id', 'customer_id')
    expect(addFavoriteProductSpy).toHaveBeenCalledWith(
      makeFakeProduct(),
      'customer_id'
    )
  })

  it('should throw if AddFavoriteProductRepository throws', async () => {
    const { sut, addFavoriteProductRepositoryStub } = makeSut()
    jest
      .spyOn(addFavoriteProductRepositoryStub, 'addFavoriteProductToCustomer')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.addFavoriteProductToCustomer(
      'product_id',
      'customer_id'
    )
    expect(promise).rejects.toThrow()
  })
})
