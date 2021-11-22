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
    console.log(`location is ${this.props.location}`)
    if (this.props.location.pathname === '/') {
      return (
      <>
      {this.props.children}
      </>
      );
    }

    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    return (
      <div style={{ fontFamily: 'courier, Lato, sans-serif', color: 'white', background: 'black'}}>
        <Header/>

        {/* SPLIT VIEW */}
          <div className="row col-md-12">

              <div className="col-lg-2 col-md-3">
                  <SidebarContent/>
              </div>

              <div className="col-lg-10 col-md-9">
                  <div className="row">
                      <div id="" className={"container-fluid"} ref={el => this.childrenElement = el}>
                          {this.props.children}
                      </div>
                  </div>
              </div>
          </div>

        {/* FOOTER */}
        <footer className="footer text-center">
          <div dangerouslySetInnerHTML={{ __html: strings.footer }}></div>
        </footer>
      </div>
    );
  }
}

export default App;
