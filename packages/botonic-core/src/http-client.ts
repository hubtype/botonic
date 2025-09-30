import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { getHubtypeApiUrl } from './config'

export interface HubtypeRequestConfig<T = any> extends AxiosRequestConfig<T> {
  hubtypeBaseUrl?: string
}

function sanitizeUrlSegment(segment: string): string {
  if (!segment) return ''
  return segment.replace(/(^\/+|\/+?$)/g, '')
}

function sanitizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '')
}

export function buildHubtypeUrl(path: string, baseUrl = getHubtypeApiUrl()): string {
  if (!path) {
    return baseUrl
  }
  return `${sanitizeBaseUrl(baseUrl)}/${sanitizeUrlSegment(path)}/`
}

function resolveUrl(
  pathOrUrl: string,
  hubtypeBaseUrl?: string
): string {
  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl
  }
  const baseUrl = hubtypeBaseUrl ?? getHubtypeApiUrl()
  return buildHubtypeUrl(pathOrUrl, baseUrl)
}

export async function hubtypeGet<T = unknown>(
  pathOrUrl: string,
  config: HubtypeRequestConfig = {}
): Promise<AxiosResponse<T>> {
  const { hubtypeBaseUrl, ...axiosConfig } = config
  return axios.get<T>(resolveUrl(pathOrUrl, hubtypeBaseUrl), axiosConfig)
}

export async function hubtypePost<T = unknown>(
  pathOrUrl: string,
  data?: unknown,
  config: HubtypeRequestConfig = {}
): Promise<AxiosResponse<T>> {
  const { hubtypeBaseUrl, ...axiosConfig } = config
  return axios.post<T>(resolveUrl(pathOrUrl, hubtypeBaseUrl), data, axiosConfig)
}

export async function hubtypeRequest<T = unknown>(
  config: HubtypeRequestConfig & { url: string }
): Promise<AxiosResponse<T>> {
  const { hubtypeBaseUrl, url, ...axiosConfig } = config
  const resolvedUrl = resolveUrl(url, hubtypeBaseUrl)
  return axios({ ...axiosConfig, url: resolvedUrl })
}
