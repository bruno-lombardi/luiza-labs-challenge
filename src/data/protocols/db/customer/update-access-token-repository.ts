export interface UpdateAccessTokenModel {
  customerId: string
  token: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    updateAccessTokenModel: UpdateAccessTokenModel
  ) => Promise<void>
}
