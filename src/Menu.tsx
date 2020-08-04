import React, { ReactElement } from 'react';

import { Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';

// import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

export default function Menu(): ReactElement {
    return (<>
        <Navbar bg="dark" variant="dark">
            {/* <Link to="/"> */}
                <Navbar.Brand href="/">Code Interview</Navbar.Brand>
            {/* </Link> */}
  
        </Navbar>
    </>);
}