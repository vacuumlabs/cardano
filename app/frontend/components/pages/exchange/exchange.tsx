import {h} from 'preact'
import styles from './exchange.module.scss'
import {ADALITE_CONFIG} from '../../../config'
import SearchableSelect from '../../common/searchableSelect'
import ChangellyApi from '../../../exchange/changellyApi'
import {useEffect, useMemo, useState} from 'preact/hooks'
import {Currency, CurrencyFull, Status} from '../../../../frontend/exchange/types'
import * as config from './config'
const APP_VERSION = ADALITE_CONFIG.ADALITE_APP_VERSION

const Exchange = () => {
  const changellyApi = useMemo(() => ChangellyApi(), [])
  const [currencies, setCurrencies] = useState([] as CurrencyFull[])

  useEffect(() => {
    ;(async () => {
      const getCurrenciesResponse = await changellyApi.getCurrencies()
      if (getCurrenciesResponse.status === Status.SUCCESS) {
        setCurrencies && setCurrencies(getCurrenciesResponse.Right)
      }
    })()
  }, [changellyApi])

  return (
    <div className="wrap">
      <nav className="navbar">
        <div className={`navbar-wrapper ${styles.navbarWrapper}`}>
          <h1 className={`navbar-heading ${styles.navbarHeading}`}>
            <span className={`navbar-title ${styles.navbarTitle}`}>AdaLite - Cardano Wallet</span>
            <a href="/">
              <img
                src="assets/adalite-logo.svg"
                alt="AdaLite - Cardano Wallet"
                className="navbar-logo"
              />
            </a>
          </h1>
          <div className={`navbar-version ${styles.navbarVersion}`}>{`Ver. ${APP_VERSION}`}</div>
        </div>
      </nav>
      <div className={`${styles.content}`}>
        <div className={`card ${styles.card}`}>
          {currencies ? (
            <div>Loaded</div>
          ) : (
            // <SearchableSelect
            //   wrapperClassName="no-margin"
            //   defaultItem={findFirstCommonElement(config.DEFAULT_SELL_CURRENCIES, currencies)}
            //   displaySelectedItemClassName="input dropdown"
            //   items={currencies}
            //   onSelect={handleDropdownOnSelect}
            //   showSearch={currencies.length >= 4}
            //   searchPredicate={searchPredicate}
            //   searchPlaceholder={`Search from ${dropdownAssetItems.length} assets by name or policy ID`}
            //   dropdownClassName="modal-dropdown"
            //   getDropdownWidth={calculateDropdownWidth}
            // />
            <div>Loading currencies</div> // TODO
          )}
        </div>
      </div>
    </div>
  )
}

export default Exchange
