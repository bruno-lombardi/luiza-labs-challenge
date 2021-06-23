import { ObjectIdValidation } from '../../../presentation/helpers/validations/object-id-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validations/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'
import { ObjectIdValidatorAdapter } from '../../adapters/validators/object-id-validator-adapter'
import { makeAddFavoriteProductValidation } from './add-favorite-product-validation-factory'

jest.mock('../../../presentation/helpers/validations/validation-composite')

describe('makeAddFavoriteProductValidation factory', () => {
  it('should call Validation Composite with all needed validations', () => {
    makeAddFavoriteProductValidation()
    const validations: Validation[] = []
    for (const field of ['customerId', 'productId']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new ObjectIdValidation(new ObjectIdValidatorAdapter(), 'customerId')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
