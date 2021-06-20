import { RequiredFieldValidation } from '../../../presentation/helpers/validations/required-field-validation'
import { ObjectIdValidation } from '../../../presentation/helpers/validations/object-id-validation'
import { ValidationComposite } from '../../../presentation/helpers/validations/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'
import { makeGetCustomerValidation } from './get-customer-validation-factory'
import { ObjectIdValidatorAdapter } from '../../adapters/validators/object-id-validator-adapter'

// Mock a module
jest.mock('../../../presentation/helpers/validations/validation-composite')

describe('makeGetCustomerValidation factory', () => {
  it('should call Validation Composite with all needed validations', () => {
    makeGetCustomerValidation()
    const validations: Validation[] = []
    for (const field of ['customerId']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new ObjectIdValidation(new ObjectIdValidatorAdapter(), 'customerId')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
