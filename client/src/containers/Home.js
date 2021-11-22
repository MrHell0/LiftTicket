import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'
import $ from 'jquery';
import initFlurry from '../utils/flurry';


initFlurry();

const doFlurry = (height) => $('body').flurry({ height: height - 10, speed: 25000, large: 16 });

class Home extends React.Component {

  componentDidMount() {
    const { innerHeight: height } = window;
    doFlurry(height);
    window.addEventListener('scroll', this.handleScroll, true);
  }


  componentDidUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  destroyScrollArrow = () => {
    if (this.arrowVisible) {
      this.nav.current.style.display = 'none';
      window.removeEventListener('scroll', this.handleScroll);
      this.arrowVisible = false;
    }
  }
  arrowVisible = true;
  nav = React.createRef();
  
  handleScroll = () => {
    this.destroyScrollArrow()
  };
  
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
        <div className={"mt-5 container-fluid d-flex justify-content-center"} style={{backgroundColor: 'black'}}>
          <div className='d-lg-inline-flex d-md-flex'>
            <div className="col-lg-5 col-lg-5 pb-5"> 
              <img src='/imgs/chair3-small.png' alt='' className={"ml-5"} width={"100%"}/>
            </div>
            <div className={"col-md-5 text-center"}>
              <div className={'d-flex-column text-center'}>
                <h1 className={"display-2 fw-bolder pt-3"}>LIFT TICKET</h1>
                <div className='pb-5 sm-fs-5 fs-3'>
                  <p>Learn DeFi and Web3</p>
                  <p>
                      on
                      <img src="/imgs/avalanche-avax-logo.svg" style={{height: '30px', paddingLeft: '15px', paddingRight: '15px'}} alt=""></img> 
                      Avalanche
                      <div className="arrow blink_slow d-md-none pt-2" ref={this.nav}>
                        <a className="fa fa-arrow-down fa-1x" href="#choose" style={{textDecoration: 'none'}}>&nbsp;</a>
                      </div>
                  </p>
                  {/* <div className="title" dangerouslySetInnerHTML={{ __html: strings.title }}></div> */}
                </div>
              </div>
              <div id="choose" className='fs-4'>Choose a learning track:</div>
              <div style={{paddingBottom: '50px', marginTop: '20px', display: 'inline-table', justifyItems: 'baseline'}}>
                <button
                className="btn btn-primary"
                onClick={() => {
                  $("body").flurry("destroy");
                  this.destroyScrollArrow();
                  this.props.history.push('/about');
                }}
                >
                  Shadowy Super Coder
                </button>
                <div style={{display: 'inline-block'}}>
                  <div><span style={{color: 'yellow'}} className="blink_me">Coming soon!</span></div>
                  <div>
                  <button
                    style={{marginLeft: '10px', paddingLeft: '70px', paddingRight: '70px'}}
                    className="btn btn-primary opacity-75"
                    onClick={() => {
                      ;
                      //this.navigateToFirstIncompleteLevel()
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
            <div style={{marginTop: '50px'}} className='fs-5 pb-4'>A Shadowy Super Coder Club production</div>
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
