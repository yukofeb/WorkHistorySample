import React, { Component } from 'react';
import Home from './Home';
import UserHistories from './UserHistories';
import { BrowserRouter, Route } from 'react-router-dom'

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/profile' component={UserHistories} />
        </div>
      </BrowserRouter>
    );
  }
}

export default Routes;