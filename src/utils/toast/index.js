import { toast } from 'react-toastify'
import './index.scss'

const toastStates = {
  success: (text, options) =>
    toast.success(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'n-toast n-toast--success',
      bodyClassName: 'n-toast__body',
      progressClassName: 'n-toast__progress--success',
      ...options,
    }),
  error: (text, options) =>
    toast.error(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'n-toast n-toast--error',
      bodyClassName: 'n-toast__body',
      progressClassName: 'n-toast__progress--error',
      ...options,
    }),
  info: toast.info,
}

export default (state, text, options) =>
  toastStates[state]
    ? toastStates[state](text, options)
    : new Error(`Bad toast state`)
