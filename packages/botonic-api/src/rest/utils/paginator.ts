import { Request } from 'express'

export const FIRST_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

type JsonResponse<T> = {
  previous?: string
  next?: string
  count: number
  results: T[]
}

export class Paginator {
  private readonly baseUrl: string
  private readonly page: number
  private readonly pageSize: number

  constructor(
    request: Request,
    page = FIRST_PAGE,
    pageSize = DEFAULT_PAGE_SIZE
  ) {
    this.baseUrl = this.getBaseUrl(request)
    this.page = page < FIRST_PAGE ? FIRST_PAGE : page
    this.pageSize = pageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : pageSize
  }

  get limit(): number {
    return this.pageSize
  }

  get offset(): number {
    return (this.page - 1) * this.pageSize
  }

  get previousUrl(): string {
    const previousPage = this.page - 1
    return `${this.baseUrl}/?page=${previousPage}&pageSize=${this.pageSize}`
  }

  get nextUrl(): string {
    const nextPage = this.page + 1
    return `${this.baseUrl}/?page=${nextPage}&pageSize=${this.pageSize}`
  }

  generateResponse<T>(items: T[]): JsonResponse<T> {
    return {
      previous: this.page > FIRST_PAGE ? this.previousUrl : undefined,
      next: items.length === this.pageSize ? this.nextUrl : undefined,
      count: items.length,
      results: items,
    }
  }

  private getBaseUrl(request: Request): string {
    return `${request.protocol}://${request.get('host')}${request.baseUrl}`
  }
}
