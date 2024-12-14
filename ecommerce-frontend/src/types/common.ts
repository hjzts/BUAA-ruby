export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total_pages: number
    current_page: number
    total_count: number
  }
}
