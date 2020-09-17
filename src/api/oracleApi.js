import axios from 'axios'
import environment from '../utils/environment'

function NetworkError({ status, message, data, statusText }) {
  this.name = 'NetworkError'
  this.message = message || statusText
  this.status = status
  this.data = data
}

NetworkError.prototype = Object.create(Error.prototype)

const oracleApi = axios.create({
  baseURL: environment.oracleApiLink,
  timeout: 1000 * 10,
  crossDomain: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

oracleApi.interceptors.response.use(
  response => Promise.resolve(response),
  error => Promise.reject(new NetworkError(error.response || error)),
)

export default oracleApi
