import React, { ReactElement, useState, useEffect } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import MultipleCodeInterview from './pages/MultipleCodeInterview';
import Home from './pages/Home';

import './Router.css';

export default function Router(): ReactElement {

  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    })
  })

  useEffect(() => {
    
  }, [])

  return (
    <HashRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/mc/:interviewId">
            <MultipleCodeInterview />
          </Route>
        </Switch>
    </HashRouter>
  );
};
