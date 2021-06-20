import { DeleteCustomer } from '../../../domain/usecases/customer/delete-customer'

import NotFoundError from '../../errors/not-found-error'
import { notFound, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { DeleteCustomerController } from './delete-customer-controller'

interface SutTypes {
  sut: DeleteCustomerController
  deleteCustomerStub: DeleteCustomer
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    customerId: 'valid_id'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeDeleteCustomer = (): DeleteCustomer => {
  class DeleteCustomerStub implements DeleteCustomer {
    async deleteCustomerById(customerId: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }
  return new DeleteCustomerStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const deleteCustomerStub = makeDeleteCustomer()
  const sut = new DeleteCustomerController(validationStub, deleteCustomerStub)
  return { sut, validationStub, deleteCustomerStub }
}

describe('DeleteCustomer Controller', () => {
  it('should call DeleteCustomer with correct value', async () => {
    const { sut, deleteCustomerStub } = makeSut()
    const getCustomerSpy = jest.spyOn(deleteCustomerStub, 'deleteCustomerById')
    await sut.handle(makeFakeRequest())
    expect(getCustomerSpy).toHaveBeenCalledWith('valid_id')
  })

  it('should return 404 if customer is not found', async () => {
    const { sut, deleteCustomerStub } = makeSut()
    jest
      .spyOn(deleteCustomerStub, 'deleteCustomerById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const httpResponse = await sut.handle(makeFakeRequest())
    const notFoundError = new NotFoundError('Customer not found')
    expect(httpResponse).toEqual(notFound(notFoundError))
  })

  it('should return 500 if DeleteCustomer throws', async () => {
    const { sut, deleteCustomerStub } = makeSut()
    jest.spyOn(deleteCustomerStub, 'deleteCustomerById').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
