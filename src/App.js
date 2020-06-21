import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import WriteExam from './components/WriteExam';

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
        <Route path = '/exam/:id' component = {WriteExam} />
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
