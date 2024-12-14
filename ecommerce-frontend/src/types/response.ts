export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  errors: string[]
}
