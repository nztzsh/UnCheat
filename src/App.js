import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';

class App extends Component {

  state = {
    loaded: true
  }

  content() {
    return(
      <div className = 'App'>
      <BrowserRouter>
      <Switch>
        <Route exact path = '/' component = {Home} />
      </Switch>
      </BrowserRouter>
      </div>
    )
  }

  render() {
    return(
      this.state.loaded ? this.content() : null
    )
  }

}

export default App;
