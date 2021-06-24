import { CustomerModel } from '../../models/customer'
import { ProductModel } from '../../models/product'

export interface AddCustomerModel {
  name: string
  email: string
  favoriteProducts?: ProductModel[]
}

export interface AddCustomer {
  add: (customer: AddCustomerModel) => Promise<CustomerModel>
}
