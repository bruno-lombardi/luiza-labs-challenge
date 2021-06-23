import { ProductModel } from './product'

export interface CustomerModel {
  id: string
  name: string
  email: string
  favoriteProducts: ProductModel[]
}
