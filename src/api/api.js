import axios from 'axios'
import constants from '../constants'

function NetworkError({ status, message, data, statusText }) {
  this.name = 'NetworkError'
  this.message = message || statusText
  this.status = status
  this.data = data
}

NetworkError.prototype = Object.create(Error.prototype)

export const nodeApi = axios.create({
  baseURL: constants.nodeInterface,
  timeout: 1000 * 5,
  headers: {
    'Content-Type': 'application/json',
  },
})

nodeApi.interceptors.response.use(
  response => Promise.resolve(response),
  error => Promise.reject(new NetworkError(error.response || {})),
)
