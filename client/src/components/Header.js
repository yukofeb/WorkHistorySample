import React, { Component } from 'react';
//import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Header extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h4" color="inherit">
              WorkHistory Sample
            </Typography>
            <Button href="/" colog="inherit" size="large">
              Home
            </Button>
            <Button href="/profile" colog="inherit" size="large">
              Profile
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
