import request from '../wallet/helpers/request'
import {ADALITE_CONFIG} from '../config'
import {RegisteredTokenMetadata} from '../types'
import {TokenRegistryApi} from './types'

export default (): TokenRegistryApi => {
  const getTokensMetadata = async (
    subjects: string[]
  ): Promise<{[subject: string]: RegisteredTokenMetadata}> => {
    const url = `${ADALITE_CONFIG.ADALITE_SERVER_URL}/api/tokenRegistry/getTokensMetadata`
    const requestBody = {subjects}
    const response = await request(url, 'POST', JSON.stringify(requestBody), {
      'Content-Type': 'application/json',
    })
    if (response.Right) {
      return response.Right.reduce((acc, tokenMetadata) => {
        const {subject, description, ticker, url, logoHex} = tokenMetadata
        acc[subject] = {subject, description, ticker, url, logoHex}
        return acc
      }, {})
    } else {
      return new Promise((resolve, reject) => resolve({}))
    }
  }

  return {
    getTokensMetadata,
  }
}
