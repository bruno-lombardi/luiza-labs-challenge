export interface DeleteCustomer {
  deleteCustomerById: (customerId: string) => Promise<boolean>
}
