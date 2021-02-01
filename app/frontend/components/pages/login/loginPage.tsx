import {h} from 'preact'
import {useState, useEffect} from 'preact/hooks'
import {useSelector, useActions} from '../../../helpers/connect'
import actions from '../../../actions'
import isLeftClick from '../../../helpers/isLeftClick'
import KeyFileAuth from './keyFileAuth'
import MnemonicAuth from './mnemonicAuth'
import HardwareAuth from './hardwareAuth'
import DemoWalletWarningDialog from './demoWalletWarningDialog'
import GenerateMnemonicDialog from './generateMnemonicDialog'
import LogoutNotification from './logoutNotification'
import LoginPageSidebar from './loginPageSidebar'
import StakingBanner from './stakingBanner'
import ErrorBanner from './errorBanner'
import Tag from '../../common/tag'
import WalletLoadingErrorModal from './walletLoadingErrorModal'
import {getTranslation} from '../../../translations'
import {errorHasHelp} from '../../../helpers/errorsWithHelp'
import {State} from '../../../state'
import {AuthMethodEnum, ScreenSize} from '../../../types'
import {AuthMethodNames} from '../../../constants'
import useViewport from '../../common/useViewport'

const getAuthMethodName = (authMethod: AuthMethodEnum): string => AuthMethodNames[authMethod]

const CurrentDropdownItem = ({
  authMethod,
  toggleDropdown,
}: {
  authMethod: AuthMethodEnum
  toggleDropdown: () => void
}) => (
  <div
    className={`dropdown-item current ${authMethod} ${
      authMethod === AuthMethodEnum.HW_WALLET ? 'recommended' : ''
    }`}
    onClick={toggleDropdown}
  >
    <span className="dropdown-item-text">{getAuthMethodName(authMethod)}</span>
  </div>
)

const DropdownItem = ({
  authMethod,
  toggleDropdown,
  tabName,
  recommended = false,
}: {
  authMethod: AuthMethodEnum
  toggleDropdown: () => void
  tabName: AuthMethodEnum
  recommended?: boolean
}) => {
  const {setAuthMethod} = useActions(actions)
  return (
    <li
      className={`dropdown-item ${tabName} ${authMethod === tabName ? 'selected' : ''} ${
        recommended ? 'recommended' : ''
      }`}
      onClick={() => {
        toggleDropdown()
        setAuthMethod(tabName)
      }}
    >
      <span className={`dropdown-item-text ${tabName}`}>{getAuthMethodName(tabName)}</span>
    </li>
  )
}

const AuthTab = ({
  authMethod,
  tabName,
  recommended = false,
}: {
  authMethod: AuthMethodEnum
  tabName: AuthMethodEnum
  recommended?: boolean
}) => {
  const {setAuthMethod} = useActions(actions)
  return (
    <li
      className={`auth-tab ${tabName} ${authMethod === tabName ? 'selected' : ''} ${
        recommended ? 'recommended' : ''
      }`}
      onClick={() => setAuthMethod(tabName)}
    >
      <span className={`auth-tab-text ${tabName}`}>{getAuthMethodName(tabName)}</span>
    </li>
  )
}

const AuthOption = ({
  tabName,
  texts,
  tag,
}: {
  tabName: AuthMethodEnum
  texts: Array<string>
  tag: string
}) => {
  const {setAuthMethod} = useActions(actions)
  return (
    <div className={`auth-option ${tabName}`} onClick={() => setAuthMethod(tabName)}>
      {tag && <Tag type={`auth ${tag}`} text={tag} />}
      <h3 className="auth-option-title">{getAuthMethodName(tabName)}</h3>
      {texts.map((text, i) => (
        <p key={i} className="auth-option-text">
          {text}
        </p>
      ))}
    </div>
  )
}

const AuthCardInitial = () => (
  <div className="authentication card initial">
    <h2 className="authentication-title">How do you want to access your Cardano Wallet?</h2>
    <div className="auth-options">
      <AuthOption
        tabName={AuthMethodEnum.MNEMONIC}
        texts={['12, 15, 24 or 27 word passphrase']}
        tag={'fastest'}
      />
      <AuthOption
        tabName={AuthMethodEnum.HW_WALLET}
        texts={['Trezor T', 'Ledger Nano S/X', 'Android device & Ledger']}
        tag={'recommended'}
      />
      <AuthOption tabName={AuthMethodEnum.KEY_FILE} texts={['Encrypted .JSON file']} tag={''} />
    </div>
  </div>
)
const AuthCard = ({
  authMethod,
  screenSize,
  isDropdownOpen,
  toggleDropdown,
}: {
  authMethod: AuthMethodEnum
  screenSize: ScreenSize
  isDropdownOpen: boolean
  toggleDropdown: () => void
}) => (
  <div className="authentication card">
    {screenSize <= ScreenSize.MOBILE ? (
      <div className={`dropdown auth ${isDropdownOpen ? 'open' : ''}`}>
        <CurrentDropdownItem authMethod={authMethod} toggleDropdown={toggleDropdown} />
        <ul className="dropdown-items">
          <DropdownItem
            authMethod={authMethod}
            tabName={AuthMethodEnum.MNEMONIC}
            toggleDropdown={toggleDropdown}
          />
          <DropdownItem
            tabName={AuthMethodEnum.HW_WALLET}
            toggleDropdown={toggleDropdown}
            authMethod={authMethod}
            recommended
          />
          <DropdownItem
            authMethod={authMethod}
            tabName={AuthMethodEnum.KEY_FILE}
            toggleDropdown={toggleDropdown}
          />
        </ul>
      </div>
    ) : (
      <ul className="auth-tabs">
        <AuthTab tabName={AuthMethodEnum.MNEMONIC} authMethod={authMethod} />
        <AuthTab tabName={AuthMethodEnum.HW_WALLET} authMethod={authMethod} recommended />
        <AuthTab tabName={AuthMethodEnum.KEY_FILE} authMethod={authMethod} />
      </ul>
    )}
    {authMethod === AuthMethodEnum.MNEMONIC && <MnemonicAuth />}
    {authMethod === AuthMethodEnum.HW_WALLET && <HardwareAuth />}
    {authMethod === AuthMethodEnum.KEY_FILE && <KeyFileAuth />}
  </div>
)

const LoginPage = () => {
  const screenSize = useViewport()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const {
    authMethod,
    shouldShowDemoWalletWarningDialog,
    logoutNotificationOpen,
    walletLoadingError,
    shouldShowGenerateMnemonicDialog,
    shouldShowWalletLoadingErrorModal,
    shouldShowStakingBanner,
    autoLogin,
    errorBannerContent,
  } = useSelector((state: State) => ({
    authMethod: state.authMethod,
    shouldShowDemoWalletWarningDialog: state.shouldShowDemoWalletWarningDialog,
    logoutNotificationOpen: state.logoutNotificationOpen,
    walletLoadingError: state.walletLoadingError,
    shouldShowGenerateMnemonicDialog: state.shouldShowGenerateMnemonicDialog,
    shouldShowWalletLoadingErrorModal: state.shouldShowWalletLoadingErrorModal,
    shouldShowStakingBanner: state.shouldShowStakingBanner,
    autoLogin: state.autoLogin,
    errorBannerContent: state.errorBannerContent,
  }))
  const {
    closeStakingBanner,
    loadDemoWallet,
    setAuthMethod,
    closeWalletLoadingErrorModal,
    loadErrorBannerContent,
  } = useActions(actions)

  useEffect(() => {
    if (autoLogin && authMethod !== AuthMethodEnum.MNEMONIC) {
      setAuthMethod(AuthMethodEnum.MNEMONIC)
    }
    loadErrorBannerContent()
  }, []) // eslint-disable-line

  return (
    <div className="page-wrapper">
      {shouldShowStakingBanner && <StakingBanner onRequestClose={() => closeStakingBanner()} />}
      {errorBannerContent && <ErrorBanner message={errorBannerContent} />}
      <div className="page-inner">
        <main className="page-main">
          {authMethod === AuthMethodEnum.INITIAL ? (
            <AuthCardInitial />
          ) : (
            <AuthCard
              authMethod={authMethod}
              screenSize={screenSize}
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
            />
          )}
          <div className="page-demo">
            Try the{' '}
            <a href="#" onMouseDown={(e) => isLeftClick(e, loadDemoWallet)}>
              demo wallet
            </a>
          </div>
        </main>
        <LoginPageSidebar />
        {shouldShowDemoWalletWarningDialog && <DemoWalletWarningDialog />}
        {shouldShowGenerateMnemonicDialog && <GenerateMnemonicDialog />}
        {logoutNotificationOpen && <LogoutNotification />}
        {shouldShowWalletLoadingErrorModal && (
          <WalletLoadingErrorModal
            onRequestClose={closeWalletLoadingErrorModal}
            errorMessage={getTranslation(walletLoadingError.code, walletLoadingError.params)}
            showHelp={errorHasHelp(walletLoadingError.code)}
          />
        )}
      </div>
    </div>
  )
}

export default LoginPage
