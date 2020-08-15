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
        <Navbar bg="dark" variant="dark" color={"#222"}>
            {/* <Link to="/"> */}
                <Navbar.Brand href="/"><span style={brandStyle}> // Code Interview</span></Navbar.Brand>
            {/* </Link> */}
  
        </Navbar>
    </>);
}