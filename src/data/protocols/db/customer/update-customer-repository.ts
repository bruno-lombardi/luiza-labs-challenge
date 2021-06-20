import { CustomerModel } from '../../../../domain/models/customer'
import { UpdateCustomerModel } from '../../../../domain/usecases/customer/update-customer'

export interface UpdateCustomerRepository {
  updateCustomer: (
    updateCustomerModel: UpdateCustomerModel
  ) => Promise<CustomerModel>
}
