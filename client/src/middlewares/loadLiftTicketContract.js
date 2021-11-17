import * as ethutil from '../utils/ethutil'
import LiftTicketABI from 'contracts/build/contracts/LiftTicket.sol/LiftTicket.json'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadLiftTicketContract = store => next => action => {
  if(action.type !== actions.LOAD_LIFT_TICKET_CONTRACT) return next(action)
  if(action.contract !== undefined) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.player.address ||
    !state.gamedata.liftTicketAddress
  ) {
    // console.log(`UNABLE TO LOAD LIFTTICKET`)
    return next(action)
  }
  // console.log(`GETTING LIFTTICKET...`, state.gamedata.liftTicketAddress)

  // Get contract template
  const LiftTicket = ethutil.getTruffleContract(
    LiftTicketABI,
    {
      from: state.player.address,
      gasPrice: state.network.gasPrice * 2
    }
  )

  // Get deployed instance
  LiftTicket.at(state.gamedata.liftTicketAddress)
    .then(instance => {

      console.info(`=> ${strings.liftTicketAddressMessage}\n${instance.address}`)

      // for player interaction via the browser's console
      window.liftTicket = instance

      action.contract = instance
      next(action)

      // Get game data
      store.dispatch(actions.syncLevelProgress())

      // Auto-restore previoius instance
      if(state.gamedata.activeLevel)
        store.dispatch(actions.loadLevelInstance(state.gamedata.activeLevel, true, false))
    })
    .catch(() => {
      console.error(`@bad ${strings.liftTicketNotFoundMessage}`)
    })
}

export default loadLiftTicketContract
