export default class ProductAlreadyFavoritedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductAlreadyFavoritedError'
  }
}
