import { toast } from 'react-toastify'
import './index.scss'

export const successToast = (
  text,
  options = {
    position: 'top-right',
    autoClose: 100000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: 'n-toast n-toast--success',
    bodyClassName: 'n-toast__body',
    progressClassName: 'n-toast__progress--success',
  },
) => toast.success(text, options)

export const errorToast = (
  text,
  options = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: 'n-toast n-toast--error',
    bodyClassName: 'n-toast__body',
    progressClassName: 'n-toast__progress--error',
  },
) => toast.success(text, options)
