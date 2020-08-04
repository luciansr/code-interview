import React, { ReactElement } from 'react';
import { BrowserRouter, Switch, Route, Link, useParams } from 'react-router-dom';
import { Jumbotron, Container, Button, ButtonToolbar, Navbar } from 'react-bootstrap';
import Menu from './Menu';
import Home from './pages/Home';
import CodeInterview from './pages/CodeInterview';

import './App.css';

export default function App(): ReactElement {

  const About = () => <span>About</span>;

  return (
    <BrowserRouter>

      <Menu></Menu>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/c/:interviewId">
          <CodeInterview />
        </Route>
      </Switch>

      {/* <Container >

  

      </Container> */}
    </BrowserRouter>
  );
};
