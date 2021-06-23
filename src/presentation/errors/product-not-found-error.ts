export default class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductNotFoundError'
  }
}
