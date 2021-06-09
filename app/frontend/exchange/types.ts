import moment = require('moment')

export type Currency = string & {__type: 'changelly-coin-ticker'}
export type Address = string & {__type: 'changelly-address'}
export type TransactionId = string & {__type: 'changelly-transaction-id'}

export type CurrencyFull = {
  name: Currency
  fullName: string
}

export enum TransactionStatus {
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  EXCHANGING = 'exchanging',
  SENDING = 'sending',
  FINISHED = 'finished',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  OVERDUE = 'overdue',
  HOLD = 'hold',
  EXPIRED = 'expired',
}

export const enum Status {
  SUCCESS,
  FAILURE,
}

export type Error = {
  code: string | number
  message?: string
}

export type ResponseWrapper<T> =
  | {
      status: Status.SUCCESS
      statusCode: number
      Right: T
    }
  | {
      status: Status.FAILURE
      statusCode: number
      Left: Error
    }

export type GetCurrenciesResponse = CurrencyFull[]

export type GetMinAmountRequest = {
  from: Currency
  to: Currency
}

export type GetMinAmountResponse = BigInt

export type GetExchangeAmountRequest = {
  from: Currency
  to: Currency
  amount: BigInt
}

export type GetExchangeAmountResponse = {
  from: Currency
  to: Currency
  networkFee: BigInt
  amount: BigInt
  result: BigInt
  visibleAmount: BigInt
  rate: BigInt
  fee: BigInt
}

export type CreateTransactionRequest = {
  from: Currency
  to: Currency
  address: Address
  amount: BigInt
}

export type CreateTransactionResponse = {
  id: TransactionId
  apiExtraFee: BigInt
  changellyFee: BigInt
  amountExpectedFrom: BigInt
  amountExpectedTo: BigInt
  status: TransactionStatus
  currencyFrom: Currency
  currencyTo: Currency
  amountTo: BigInt
  payinAddress: Address
  payoutAddress: Address
  createdAt: moment.Moment // TODO: parse
}

export type GetStatusRequest = {
  id: TransactionId
}

export type GetStatusResponse = TransactionStatus

export type ChangellyApi = {
  getCurrencies: () => Promise<ResponseWrapper<GetCurrenciesResponse>>
  getMinAmount: (request: GetMinAmountRequest) => Promise<ResponseWrapper<GetMinAmountResponse>>
  getExchangeAmount: (
    request: GetExchangeAmountRequest
  ) => Promise<ResponseWrapper<GetExchangeAmountResponse>>
  createTransaction: (
    request: CreateTransactionRequest
  ) => Promise<ResponseWrapper<CreateTransactionResponse>>
  getStatus: (request: GetStatusRequest) => Promise<ResponseWrapper<GetStatusResponse>>
}
