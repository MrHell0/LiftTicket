import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'
import $ from 'jquery';
import initFlurry from '../utils/flurry';


initFlurry();

const doFlurry = () => $('body').flurry({ height: 600, speed: 25000, large: 16 });

class Home extends React.Component {

  componentDidMount() {
      doFlurry();
  }

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
    
    let language = localStorage.getItem('lang')
    //eslint-disable-next-line
    let strings = loadTranslations(language)
    
    return (
        <div style={{backgroundColor: 'black'}}>
          <div style={{display: 'flex', marginTop: '10px', alignItems: 'center', justifyContent: 'center'}}>
            <div>
              <img src='/imgs/chair3-small.png' alt='' style={{height: '800px', paddingTop: '10px', marginRight: '20px'}}></img>
            </div>
            <div style={{display: 'inline-block', maxWidth: '35%' , textAlign: 'center', paddingTop: '50px', fontWeight: '900'}}>
              <div style={{display: 'inline-block'}}>
                <div style={{fontSize: '5em', paddingBottom: '20px'}}>Lift Ticket</div>
                <div style={{paddingBottom: '20px', fontSize: '3em'}}>
                  <p>Learn DeFi and Web3</p>
                  <p>
                    on
                    <img src="/imgs/avalanche-avax-logo.svg" style={{height: '30px', paddingLeft: '15px', paddingRight: '15px'}} alt=""></img> 
                  <a href="https://avax.network" target="blank">Avalanche</a>
                  </p>
                  {/* <div className="title" dangerouslySetInnerHTML={{ __html: strings.title }}></div> */}
                </div>
              </div>
              <div>Choose a learning track to start:</div>
              <div style={{paddingBottom: '50px', marginTop: '20px', display: 'inline-table', justifyItems: 'baseline'}}>
                <button
                className="btn btn-primary"
                onClick={() => {
                  $("body").flurry("destroy");
                  this.navigateToFirstIncompleteLevel();
                }}
                >
                  Shadowy Super Coder
                </button>
                <div style={{display: 'inline-block'}}>
                  <div><span style={{color: 'yellow'}} className="blink_me">Coming soon!</span></div>
                  <div>
                  <button
                    style={{marginLeft: '10px', paddingLeft: '70px', paddingRight: '70px'}}
                    className="btn btn-primary"
                    onClick={() => {
                      $("body").flurry("destroy");
                      this.navigateToFirstIncompleteLevel()
                    }}>
                    DeFi Degen
                  </button>
                  </div>
                </div>
              </div>
              
              {/* INFO */}
             {/*  <div dangerouslySetInnerHTML={{ __html: strings.info }} style={{fontSize: '1em', textAlign: 'left'}}></div>
              
              <div style={{fontSize: '1em'}}>
                <p>Like this? Donations welcome: 0x816f3CBfEF3c51f5A9ECc2f0774bEdEC0D077922 <br />
                A Shadowy Super Coder Club production <br />
                Artwork by <a href='https://twitter.com/MarvinParadox' target='_blank'rel="noopener noreferrer">@MarvinParadox</a></p>
              </div>   */}
            <div style={{marginTop: '50px'}}>A Shadowy Super Coder Club production</div>
            </div>
            
          </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
