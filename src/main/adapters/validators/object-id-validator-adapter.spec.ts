import { ObjectIdValidatorAdapter } from './object-id-validator-adapter'
import { ObjectID } from 'mongodb'

jest.mock('mongodb', () => ({
  ObjectID: {
    isValid(): boolean {
      return true
    }
  }
}))

const makeSut = (): ObjectIdValidatorAdapter => {
  return new ObjectIdValidatorAdapter()
}

describe('ObjectIdValidatorAdapter', () => {
  it('should return false if mongodb ObjectID.isValid returns false', () => {
    const sut = makeSut()
    jest.spyOn(ObjectID, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_id')
    expect(isValid).toBe(false)
  })

  it('should return true if mongodb ObjectID.isValid returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_id')
    expect(isValid).toBe(true)
  })

  it('should call mongodb ObjectID.isValid with correct email', () => {
    const sut = makeSut()
    const isValid = jest.spyOn(ObjectID, 'isValid')
    sut.isValid('any_id')
    expect(isValid).toHaveBeenCalledWith('any_id')
  })
})
