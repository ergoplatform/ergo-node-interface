import axios from 'axios'

function NetworkError({ status, message, data, statusText }) {
  this.name = 'NetworkError'
  this.message = message || statusText
  this.status = status
  this.data = data
}

NetworkError.prototype = Object.create(Error.prototype)

export const nodeApi = axios.create({
  baseURL: 'http://0.0.0.0:9053/',
  timeout: 1000 * 5,
  headers: {
    'Content-Type': 'application/json'
  }
})

nodeApi.interceptors.response.use(
  response => Promise.resolve(response),
  error => Promise.reject(new NetworkError(error.response || {}))
)
