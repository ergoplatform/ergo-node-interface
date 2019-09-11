import React from 'react'

export const ApiKeyContext = React.createContext({
  value: null,
  setApiKey: () => {},
})

export default {
  ApiKeyContext,
}
