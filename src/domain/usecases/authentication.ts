export interface AuthParams {
  email: string
}

export interface Authentication {
  auth: (authenticationParams: AuthParams) => Promise<string>
}
