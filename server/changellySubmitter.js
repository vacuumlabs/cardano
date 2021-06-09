require('isomorphic-fetch')
const Sentry = require('@sentry/node')
const {backendConfig} = require('./helpers/loadConfig')
const {generateId, sign} = require('./helpers/changelly')

const changellyRequest = async (method, params, res, transformBody = null) => {
  const apiKey = backendConfig.CHANGELLY_API_KEY
  const message = {
    method,
    jsonrpc: '2.0',
    params,
    id: generateId(),
  }

  try {
    const response = await fetch(backendConfig.CHANGELLY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'sign': sign(message),
      },
      body: JSON.stringify(message),
    })
    if (response.status === 200) {
      const body = await response.json()
      if (body.error) {
        return res.json({
          statusCode: response.status,
          Left: {
            code: body.error.code,
            message: body.error.message,
          },
        })
      }
      return res.json({
        statusCode: response.status,
        Right: transformBody ? transformBody(body.result) : body.result,
      })
    }
    return res.json({
      statusCode: response.status,
      Left: {
        code: 'Unexpected error',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Call to Changelly for method ${method} with params ${JSON.stringify(
        params
      )} failed with an unexpected error: ${err.stack}`
    )
    Sentry.captureException(err)
    return res.json({
      statusCode: 500,
      Left: 'An unexpected error has occurred',
    })
  }
}

module.exports = function(app, env) {
  app.get('/api/changelly/getCurrencies', (req, res) => {
    changellyRequest('getCurrenciesFull', {}, res, (body) =>
      body
        .filter((currencyFull) => currencyFull?.enabled)
        .map(({name, fullName}) => ({name, fullName}))
    )
  })
  ;['getMinAmount', 'getExchangeAmount', 'createTransaction', 'getStatus'].forEach((method) => {
    app.post(`/api/changelly/${method}`, (req, res) => {
      changellyRequest(method, req.body, res)
    })
  })
}
