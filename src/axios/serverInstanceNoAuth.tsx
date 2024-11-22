const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN
const ADDRESS_DOMAIN = import.meta.env.VITE_ADDRESS_DOMAIN

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { _const } from "../_constant"
import storage from "../utils/storage"

const getTokenAuthHeader = (token: string) => `${token}`

const createNoAuthInstance = (API: string) => {
  const serverInstanceNoAuth = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
  })

  const interceptorsRq = (config: InternalAxiosRequestConfig<any>) => {
    let accessToken =
      storage.getAccessToken() ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBhcmVudElkIjpudWxsLCJjbGllbnRJZCI6ImVhMmU0OTJkLWYwNDItNDljZS05MTQ2LTFlNzBlYzdhYWI3ZCIsInJvbGUiOjUwLCJsZXZlbCI6NDAsImN1c3RvbWVySWQiOjYsImlhdCI6MTcyNDY3OTYyMSwiZXhwIjoxNzI3MjcxNjIxfQ.Eoy2a4pGvPikuT1vTGZHrrOal7dAhk5kjNcFml0TG54"

    config.headers["x-mobicam-token"] = getTokenAuthHeader(accessToken)

    config.timeout = 60000 * 5 || _const?.axios?.timeout

    return config
  }
  const interceptorsRqError = (error: any) => {
    return Promise.reject(error)
  }

  const interceptorsRs = (response: AxiosResponse<any, any>) => {
    return response?.data
  }
  const interceptorsRsError = (error: any) => {
    return Promise.reject(error?.response?.data)
  }

  serverInstanceNoAuth.interceptors.request.use(
    interceptorsRq,
    interceptorsRqError,
  )
  serverInstanceNoAuth.interceptors.response.use(
    interceptorsRs,
    interceptorsRsError,
  )

  return serverInstanceNoAuth
}

export const serverInstanceNoAuth = createNoAuthInstance(SERVER_DOMAIN)
export const addressInstance = createNoAuthInstance(ADDRESS_DOMAIN)

// export const axiosInstance = createNoAuthInstance(
//   "https://midvnremindbe-production.up.railway.app/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://192.168.2.24:3005/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://192.168.2.42:3005/api/v1/remind/",
// )

export const axiosInstance = createNoAuthInstance(
  "http://26.73.188.74:3005/api/v1/remind/",
)

export const axiosFireBaseInstance = createNoAuthInstance(
  "http://192.168.2.42:3005/api/v1/token-firebase/",
)
