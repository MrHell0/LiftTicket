import React from 'react';
import Header from './Header';
import SidebarContent from './Sidebar';
import { loadTranslations } from '../utils/translations'

class App extends React.Component {

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname === '/') { return }
    if(this.props.location !== prevProps.location) {
      this.childrenElement.parentElement.scrollTop = 0
    }
  }

  render() {
    const { innerWidth: width } = window;
    
    if (this.props.location.pathname === '/') {
      return (
      <>
      {this.props.children}
      </>
      );
    }

    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    if (width > 768) {
      return (
        <div style={{ fontFamily: 'courier', color: 'white', background: 'black'}}>
          <Header/>

          {/* SPLIT VIEW */}

          <div className="row col-md-12">
            <div className="col-md-2">
              <SidebarContent/>
            </div>
            <div className="col-lg-10 col-md-9 overflow-x">
              <div id="" className="container-fluid px-0" ref={el => this.childrenElement = el}>
                {this.props.children}
              </div>
            </div>
          </div>
          <footer className="footer text-center">
            <div dangerouslySetInnerHTML={{ __html: strings.footer }}></div>
          </footer>
        </div>
      );

    } else {
    return (
        <div style={{ fontFamily: 'courier', color: 'white', background: 'black'}} className='container-fluid px-0'>
          <Header/>
          <div id="" className="container px-0 overflow-x" ref={el => this.childrenElement = el}>
            {this.props.children}
          </div>
          {/* <div className='navbar navbar-fixed-bottom'>
            drop up
          </div> */}
        </div>
      );
    }
  }
}

export default App;
