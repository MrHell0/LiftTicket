import React from 'react'
import * as constants from '../constants';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class About extends React.Component {
   navigateToFirstIncompleteLevel() {

    // Find first incomplete level
    let target = this.props.levels[0].deployedAddress
    for(let i = 0; i < this.props.levels.length; i++) {
      const level = this.props.levels[i]
      const completed = this.props.completedLevels[level.deployedAddress]
      if(!completed) {
        target = level.deployedAddress
        break
      }
    }

    // Navigate to first incomplete level
    this.props.history.push(`${constants.PATH_LEVEL_ROOT}${target}`)
  }

  render() {
    return (
      <div className="page-container">
        <h2 className="title">About</h2>
        <div>
            <p>Lift Ticket is a Web3/Solidity game based on <a href='https://ethernaut.openzeppelin.com' target='_blank' rel='noopener noreferrer'>Ethernaut</a>,
             running on the Avalanche network. Each level is a smart contract that needs to be 'hacked'.
             </p>
             <p>
                <button
                  style={{marginLeft: '10px', paddingLeft: '70px', paddingRight: '70px'}}
                  className="btn btn-primary opacity-75"
                  onClick={() => {
                      ;
                      this.navigateToFirstIncompleteLevel()
                 }}>
                    Begin!
                </button>
             </p>
             <p>The game is 100% open source and all levels are contributions made by other players. Do you have an interesting idea? PRs are welcome at <a href='https://github.com/MrHell0/LiftTicket'>github.com/MrHell0/LiftTicket</a>.</p>
             <p> You like the game but your language is not available? 
                 <a href='https://github.com/MrHell0/LiftTicket/tree/master/README.md#adding-new-languages' target='_blank' rel='noopener noreferrer'>
                 <strong style={{ color: '#eb5424', fontWeight: 600 }}> Contribute a translation!</strong></a>
            </p>
            <p>Like this? Donations welcome: 0x816f3CBfEF3c51f5A9ECc2f0774bEdEC0D077922</p>
            <p>Artwork by <a href="https://twitter.com/MarvinParadox" target="_blank" rel="noopener noreferrer">MarvinParadox</a></p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.lang,
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About)
