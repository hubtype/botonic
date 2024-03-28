import axios from 'axios'

export type ApiOptions = {
  timeout?: number
}

enum Methods {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

export const DEFAULT_API_CALL_TIMEOUT_MS = 28000

export default class Api {
  protected headers: Record<string, string>
  protected readonly timeout

  constructor(options?: ApiOptions) {
    this.headers = {
      'Content-Type': 'application/json',
    }
    this.timeout = options?.timeout ?? DEFAULT_API_CALL_TIMEOUT_MS
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doCall<T>(endpoint, Methods.GET, params, headers)
  }

  async post<T>(
    endpoint: string,
    data: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doCall<T>(endpoint, Methods.POST, data, headers)
  }

  async delete<T>(
    endpoint: string,
    data?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doCall<T>(endpoint, Methods.DELETE, data, headers)
  }

  async put<T>(
    endpoint: string,
    data?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doCall<T>(endpoint, Methods.PUT, data, headers)
  }

  protected async doCall<T>(
    endpoint: string,
    method: Methods,
    data?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    const resp = await axios({
      method: method,
      url: endpoint,
      params: method === Methods.POST ? undefined : data,
      data: method === Methods.POST ? data : undefined,
      headers: { ...this.headers, ...headers },
      timeout: this.timeout,
    })
    return resp.data
  }
}
