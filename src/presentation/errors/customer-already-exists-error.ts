export default class CustomerAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomerAlreadyExistsError'
  }
}
