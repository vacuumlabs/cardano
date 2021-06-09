const {backendConfig} = require('./loadConfig')
const crypto = require('crypto')

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const sign = (message) =>
  crypto
    .createHmac('sha512', backendConfig.CHANGELLY_API_SECRET)
    .update(JSON.stringify(message))
    .digest('hex')

module.exports = {
  generateId,
  sign,
}
