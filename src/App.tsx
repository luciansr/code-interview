import React, { ReactElement } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Menu from './Menu';

import { Home, CodeInterview, MultipleCodeInterview } from './pages';

import './App.css';

export default function App(): ReactElement {

  return (
    <HashRouter>
      <Menu></Menu>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/c/:interviewId">
          <CodeInterview />
        </Route>
        <Route path="/mc/:interviewId">
          <MultipleCodeInterview />
        </Route>
      </Switch>
    </HashRouter>
  );
};
