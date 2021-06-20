import { ObjectID } from 'mongodb'
import { ObjectIdValidator } from '../../../presentation/protocols/object-id-validator'

export class ObjectIdValidatorAdapter implements ObjectIdValidator {
  isValid(id: string): boolean {
    return ObjectID.isValid(id)
  }
}
