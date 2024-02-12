import { useSearchParams } from "react-router-dom"
import VerifyEmail from "../components/VerifyEmail"
import ResetPassword from "../components/ResetPassword"

enum AccountSetupMode {
  VERIFY_EMAIL = 'verifyEmail',
  RESET_PASSWORD = 'resetPassword',
  RECOVER_EMAIL = 'recoverEmail'
}

const AccountSetup = () => {
    const [params,] = useSearchParams()
    const mode = params.get('mode')
    switch(mode) {
      case AccountSetupMode.VERIFY_EMAIL:
        return <VerifyEmail />
      case AccountSetupMode.RESET_PASSWORD:
        return <ResetPassword />
      default:
        return null
    }
}

export default AccountSetup