import {h} from 'preact'
import {printConversionRate} from '../../helpers/printConversionRates'

interface Props {
  balance: number
  conversionRates: any
}

const Conversions = ({balance, conversionRates}: Props) => (
  <div className="conversions">
    <div className="conversions-item">{`$ ${printConversionRate(
      balance,
      conversionRates,
      'USD'
    )}`}</div>
    <div className="conversions-item">{`€ ${printConversionRate(
      balance,
      conversionRates,
      'EUR'
    )}`}</div>
  </div>
)

export default Conversions