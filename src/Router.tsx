import React, { ReactElement } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';

import { Home, CodeInterview, MultipleCodeInterview } from './pages';

import './Router.css';

export default function Router(): ReactElement {

  return (
    <HashRouter>
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
