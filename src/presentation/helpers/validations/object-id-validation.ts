import InvalidParamError from '../../errors/invalid-param-error'
import { ObjectIdValidator } from '../../protocols/object-id-validator'
import { Validation } from '../../protocols/validation'

export class ObjectIdValidation implements Validation {
  constructor(
    private readonly objectIdValidator: ObjectIdValidator,
    private readonly fieldName: string
  ) {}

  validate(input: Record<string, any>): Error {
    const isObjectIdValid = this.objectIdValidator.isValid(
      input[this.fieldName]
    )
    if (!isObjectIdValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
