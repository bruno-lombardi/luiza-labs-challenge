import { ObjectIdValidation } from '../../../presentation/helpers/validations/object-id-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validations/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'
import { ObjectIdValidatorAdapter } from '../../adapters/validators/object-id-validator-adapter'

export const makeDeleteCustomerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['customerId']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new ObjectIdValidation(new ObjectIdValidatorAdapter(), 'customerId')
  )
  return new ValidationComposite(validations)
}
