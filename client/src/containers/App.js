import React from 'react';
import Sidebar from 'react-sidebar';
import Header from './Header';
import SidebarContent from './Sidebar';
import ReactGA from 'react-ga'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class App extends React.Component {

  constructor() {
    super()

    // Analytics
    ReactGA.initialize(constants.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if(this.props.location !== prevProps.location) {
      this.childrenElement.parentElement.scrollTop = 0
    }
  }

  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    return (
      <div style={{ fontFamily: 'courier, Lato, sans-serif', color: 'white', background: 'black'}}>
        <Header/>

        {/* SPLIT VIEW */}
        <Sidebar
          sidebar={<div style={{ width: '200px' }}><SidebarContent/></div>}
          transitions={false}
          docked={true}
          shadow={false}
          styles={{ root: { top: 62, bottom: 20 }, sidebar: { boxShadow: 'none' }, content: { overflowX: 'hidden' }}}
        >
        <div id="main" ref={el => this.childrenElement = el}>
          {this.props.children}
        </div>
        </Sidebar>

        {/* FOOTER */}
        <footer className="footer text-center">
          <div dangerouslySetInnerHTML={{ __html: strings.footer }}></div>
        </footer>
      </div>
    );
  }
}

export default App;
