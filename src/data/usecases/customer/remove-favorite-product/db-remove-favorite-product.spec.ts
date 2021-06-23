import { CustomerModel } from '../../../../domain/models/customer'
import { ProductModel } from '../../../../domain/models/product'
import { RemoveFavoriteProductRepository } from '../../../protocols/db/customer/remove-favorite-product-repository'
import { FindCustomerFavoriteProductRepository } from '../../../protocols/db/customer/find-customer-favorite-product-repository'
import { DbRemoveFavoriteProduct } from './db-remove-favorite-product'

const makeFakeProduct = (): ProductModel => ({
  price: 999.0,
  image: 'any_image_url',
  brand: 'any_brand',
  id: 'any_id',
  title: 'any_title',
  reviewScore: 4.0
})

const makeFakeCustomer = (): CustomerModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  favoriteProducts: []
})

const makeRemoveFavoriteProductRepository = (): RemoveFavoriteProductRepository => {
  class RemoveFavoriteProductRepositoryStub
    implements RemoveFavoriteProductRepository {
    async removeFavoriteProductFromCustomer(
      productId: string,
      customerId: string
    ): Promise<CustomerModel> {
      return await new Promise((resolve) => resolve(makeFakeCustomer()))
    }
  }
  return new RemoveFavoriteProductRepositoryStub()
}

const makeFindCustomerFavoriteProductRepository = (): FindCustomerFavoriteProductRepository => {
  class FindCustomerFavoriteProductRepositoryStub
    implements FindCustomerFavoriteProductRepository {
    async findCustomerFavoriteProduct(
      productId: string,
      customerId: string
    ): Promise<ProductModel> {
      return await new Promise((resolve) => resolve(makeFakeProduct()))
    }
  }
  return new FindCustomerFavoriteProductRepositoryStub()
}

interface SutTypes {
  sut: DbRemoveFavoriteProduct
  removeFavoriteProductRepositoryStub: RemoveFavoriteProductRepository
  findCustomerFavoriteProductRepositoryStub: FindCustomerFavoriteProductRepository
}

const makeSut = (): SutTypes => {
  const removeFavoriteProductRepositoryStub = makeRemoveFavoriteProductRepository()
  const findCustomerFavoriteProductRepositoryStub = makeFindCustomerFavoriteProductRepository()
  const sut = new DbRemoveFavoriteProduct(
    removeFavoriteProductRepositoryStub,
    findCustomerFavoriteProductRepositoryStub
  )
  return {
    sut,
    removeFavoriteProductRepositoryStub,
    findCustomerFavoriteProductRepositoryStub
  }
}

describe('DbRemoveFavoriteProduct UseCase', () => {
  it('should call FindCustomerFavoriteProductRepository with customer and product id', async () => {
    const { sut, findCustomerFavoriteProductRepositoryStub } = makeSut()
    const findCustomerFavoriteProductSpy = jest.spyOn(
      findCustomerFavoriteProductRepositoryStub,
      'findCustomerFavoriteProduct'
    )
    await sut.removeFavoriteProductFromCustomer('product_id', 'customer_id')
    expect(findCustomerFavoriteProductSpy).toHaveBeenCalledWith(
      'product_id',
      'customer_id'
    )
  })

  it('should throw error if FindCustomerFavoriteProductRepository null (product not favorited by customer)', async () => {
    const { sut, findCustomerFavoriteProductRepositoryStub } = makeSut()
    jest
      .spyOn(
        findCustomerFavoriteProductRepositoryStub,
        'findCustomerFavoriteProduct'
      )
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const promise = sut.removeFavoriteProductFromCustomer(
      'product_id',
      'customer_id'
    )
    expect(promise).rejects.toThrow('This product was not found')
  })

  it('should call RemoveFavoriteProductRepository with product found and with client', async () => {
    const { sut, removeFavoriteProductRepositoryStub } = makeSut()
    const addFavoriteProductSpy = jest.spyOn(
      removeFavoriteProductRepositoryStub,
      'removeFavoriteProductFromCustomer'
    )
    await sut.removeFavoriteProductFromCustomer('product_id', 'customer_id')
    expect(addFavoriteProductSpy).toHaveBeenCalledWith(
      'product_id',
      'customer_id'
    )
  })

  it('should throw if RemoveFavoriteProductRepository throws', async () => {
    const { sut, removeFavoriteProductRepositoryStub } = makeSut()
    jest
      .spyOn(
        removeFavoriteProductRepositoryStub,
        'removeFavoriteProductFromCustomer'
      )
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.removeFavoriteProductFromCustomer(
      'product_id',
      'customer_id'
    )
    expect(promise).rejects.toThrow()
  })
})
