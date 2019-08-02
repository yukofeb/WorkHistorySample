import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Routes from './Routes';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <Routes />
      </React.Fragment>
    );
  }
}

export default App;