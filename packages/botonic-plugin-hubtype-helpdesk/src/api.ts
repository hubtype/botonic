import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios'

export type ApiOptions = {
  headers?: AxiosRequestHeaders
  timeout?: number
  retries?: number
}

enum Methods {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

type DoCallOptions = {
  data?: Record<string, any>
  headers?: AxiosRequestHeaders
  timeout?: number
  retries?: number
}

type ApiCallOptionsBase = {
  headers?: AxiosRequestHeaders
  timeout?: number
  retries?: number
}

type ApiGetOptions = ApiCallOptionsBase & {
  params?: Record<string, any>
}

type ApiPostOptions = ApiCallOptionsBase & {
  data: Record<string, any>
}

type ApiDeleteOptions = ApiCallOptionsBase & {
  data?: Record<string, any>
}

type ApiPutOptions = ApiCallOptionsBase & {
  data?: Record<string, any>
}

export const DEFAULT_API_CALL_TIMEOUT_MS = 28000
export const DEFAULT_API_CALL_RETRIES = 5

export default class Api {
  protected headers: AxiosRequestHeaders
  protected readonly timeout
  protected readonly retries

  constructor(options?: ApiOptions) {
    this.headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    } as AxiosRequestHeaders
    this.timeout = options?.timeout ?? DEFAULT_API_CALL_TIMEOUT_MS
    this.retries = options?.retries ?? DEFAULT_API_CALL_RETRIES
  }

  async get<T>(endpoint: string, options: ApiGetOptions = {}): Promise<T> {
    return this.doCall<T>(endpoint, Methods.GET, {
      data: options.params,
      ...options,
    })
  }

  async post<T>(endpoint: string, options: ApiPostOptions): Promise<T> {
    return this.doCall<T>(endpoint, Methods.POST, options)
  }

  async delete<T>(
    endpoint: string,
    options: ApiDeleteOptions = {}
  ): Promise<T> {
    return this.doCall<T>(endpoint, Methods.DELETE, options)
  }

  async put<T>(endpoint: string, options: ApiPutOptions = {}): Promise<T> {
    return this.doCall<T>(endpoint, Methods.PUT, options)
  }

  protected async doCall<T>(
    endpoint: string,
    method: Methods,
    options: DoCallOptions
  ): Promise<T> {
    const result = await this.axiosRequestWithRetry<T>(
      {
        method: method,
        url: endpoint,
        params: method === Methods.POST ? undefined : options.data,
        data: method === Methods.POST ? options.data : undefined,
        headers: { ...this.headers, ...options.headers },
        timeout: options.timeout ?? this.timeout,
      },
      options.retries ?? this.retries
    )

    return result.data
  }

  protected async axiosRequestWithRetry<T>(
    requestConfig: AxiosRequestConfig,
    maxTry: number,
    retryCount = 1
  ): Promise<AxiosResponse<T, any>> {
    try {
      const result = await axios(requestConfig)
      return result
    } catch (e) {
      console.warn(`Retry ${retryCount} failed.`)
      if (retryCount > maxTry - 1) {
        console.warn(`All ${maxTry} retry attempts exhausted`)
        throw e
      }
      return this.axiosRequestWithRetry(requestConfig, maxTry, retryCount + 1)
    }
  }
}
