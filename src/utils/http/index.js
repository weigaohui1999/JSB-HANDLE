import axios from 'axios'
import { resReject, resResolve, reqReject, reqResolve } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    timeout: 3000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resResolve, resReject)
  return service
}

export const request = createAxios({
  baseURL: 'http://114.116.73.148:8086',
})
