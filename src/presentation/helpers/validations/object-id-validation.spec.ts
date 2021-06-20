import InvalidParamError from '../../errors/invalid-param-error'

import { ObjectIdValidation } from './object-id-validation'
import { ObjectIdValidator } from '../../protocols/object-id-validator'
import { ObjectID } from 'mongodb'

interface SutTypes {
  sut: ObjectIdValidation
  objectIdValidatorStub: ObjectIdValidator
}

const makeObjectIdValidator = (): ObjectIdValidator => {
  class ObjectIdValidatorStub implements ObjectIdValidator {
    isValid(id: string): boolean {
      return true
    }
  }
  return new ObjectIdValidatorStub()
}

const makeFakeObjectId = (): { id: string } => ({
  id: new ObjectID().toHexString()
})

const makeSut = (): SutTypes => {
  const objectIdValidatorStub = makeObjectIdValidator()
  const sut = new ObjectIdValidation(objectIdValidatorStub, 'id')
  return {
    sut,
    objectIdValidatorStub
  }
}

describe('ObjectIdValidation', () => {
  it('should return error if ObjectIdValidator returns false', async () => {
    const { sut, objectIdValidatorStub } = makeSut()
    jest.spyOn(objectIdValidatorStub, 'isValid').mockReturnValueOnce(false)
    const fakeId = makeFakeObjectId()
    const error = sut.validate(fakeId)
    expect(error).toEqual(new InvalidParamError('id'))
  })
  it('should call ObjectIdValidator isValid with correct value', () => {
    const { sut, objectIdValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(objectIdValidatorStub, 'isValid')
    const fakeId = makeFakeObjectId()
    sut.validate(fakeId)
    expect(isValidSpy).toHaveBeenCalledWith(fakeId.id)
  })
  it('should throw if ObjectIdValidator throws', () => {
    const { sut, objectIdValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(objectIdValidatorStub, 'isValid')
    const fakeId = makeFakeObjectId()
    sut.validate(fakeId)
    expect(isValidSpy).toHaveBeenCalledWith(fakeId.id)
  })
})
