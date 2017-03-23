import { Navigation } from 'react-native-navigation'
import screens from '../constants/Screens'
import Loading from './Loading'
import Walkthrough from './Walkthrough'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SalonsMap from './SalonsMap'
import Menu from './Menu'
import AccountButton from '../components/AccountButton'
import LandingStep2 from './LandingStep2'
import Checkout from './Checkout'
import SelectPackage from './SelectPackage'
import BuyPackage from './BuyPackage'
import PackageConfirmation from './PackageConfirmation'
import RequestConfirmation from './RequestConfirmation'
import Requested from './Requested'
import RequestedAppointments from './RequestedAppointments'
import ScheduledAppointments from './ScheduledAppointments'
import Scheduled from './Scheduled'
import PastAppointments from './PastAppointments'
import CancellationPolicy from './CancellationPolicy'
import BuyCancellation from './BuyCancellation'
import SalonInfo from '../components/SalonsMap/SalonInfo'
import WaitingList from '../components/SalonsMap/WaitingList'
import SimpleSpinner from './SimpleSpinner'

// register all screens of the app (including internal ones)
export function registerScreens (store, Provider) {
  Navigation.registerComponent(screens.LOADING, () => Loading, store, Provider)
  Navigation.registerComponent(screens.WALKTHROUGH, () => Walkthrough, store, Provider)
  Navigation.registerComponent(screens.SIGN_UP, () => SignUp, store, Provider)
  Navigation.registerComponent(screens.SIGN_IN, () => SignIn, store, Provider)
  Navigation.registerComponent(screens.SALONS_MAP, () => SalonsMap, store, Provider)
  Navigation.registerComponent(screens.MENU, () => Menu, store, Provider)
  Navigation.registerComponent(screens.ACCOUNT_BUTTON, () => AccountButton, store, Provider)
  Navigation.registerComponent(screens.LANDING_STEP_2, () => LandingStep2, store, Provider)
  Navigation.registerComponent(screens.CHECKOUT, () => Checkout, store, Provider)
  Navigation.registerComponent(screens.SELECT_PACKAGE, () => SelectPackage, store, Provider)
  Navigation.registerComponent(screens.BUY_PACKAGE, () => BuyPackage, store, Provider)
  Navigation.registerComponent(screens.PACKAGE_CONFIRMATION, () => PackageConfirmation, store, Provider)
  Navigation.registerComponent(screens.REQUEST_CONFIRMATION, () => RequestConfirmation, store, Provider)
  Navigation.registerComponent(screens.REQUESTED, () => Requested, store, Provider)
  Navigation.registerComponent(screens.REQUESTED_APPOINTMENTS, () => RequestedAppointments, store, Provider)
  Navigation.registerComponent(screens.SCHEDULED_APPOINTMENTS, () => ScheduledAppointments, store, Provider)
  Navigation.registerComponent(screens.SCHEDULED, () => Scheduled, store, Provider)
  Navigation.registerComponent(screens.PAST_APPOINTMENTS, () => PastAppointments, store, Provider)
  Navigation.registerComponent(screens.CANCELLATION_POLICY, () => CancellationPolicy, store, Provider)
  Navigation.registerComponent(screens.BUY_CANCELLATION, () => BuyCancellation, store, Provider)
  Navigation.registerComponent(screens.SALON_INFO, () => SalonInfo, store, Provider)
  Navigation.registerComponent(screens.WAITING_LIST, () => WaitingList, store, Provider)
  Navigation.registerComponent(screens.SIMPLE_SPINNER, () => SimpleSpinner, store, Provider)
}
