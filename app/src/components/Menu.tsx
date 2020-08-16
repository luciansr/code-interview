import React, { ReactElement, CSSProperties } from 'react';

import { Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';

// import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

const brandStyle: CSSProperties =  {
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
    fontWeight: 700,
    fontSize: "1.1rem",
}

export default function Menu(): ReactElement {
    return (<>
        <Navbar bg="d2ark" variant="dark" style={{backgroundColor:"rgb(29 31 33 / 1)", border: "2px solid #282a2e"}}>
            {/* <Link to="/"> */}
                <Navbar.Brand href="/"><span style={brandStyle}> // Code Interview</span></Navbar.Brand>
            {/* </Link> */}
  
        </Navbar>
    </>);
}