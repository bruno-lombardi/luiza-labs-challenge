import { CompareFieldsValidation } from '../../../presentation/helpers/validations/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validations/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validations/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Validation } from '../../../presentation/protocols/validation'
import { makeSignUpValidation } from './signup-validation-factory'

// Mock a module
jest.mock('../../../presentation/helpers/validations/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('makeSignUpValidation factory', () => {
  it('should call Validation Composite with all needed validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'email_confirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('email', 'email_confirmation'))
    const emailValidator = makeEmailValidator()
    validations.push(new EmailValidation(emailValidator, 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
