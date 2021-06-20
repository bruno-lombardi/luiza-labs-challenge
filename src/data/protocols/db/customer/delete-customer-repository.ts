export interface DeleteCustomerRepository {
  deleteCustomerById: (customerId: string) => Promise<boolean>
}
