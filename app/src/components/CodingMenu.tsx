import React, { ReactElement, CSSProperties } from 'react';

import { Button, Navbar, Nav, Form, FormControl, NavDropdown } from 'react-bootstrap';

// import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

const brandStyle: CSSProperties = {
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
    fontWeight: 700,
    fontSize: "1.1rem",
}

const navStyle: CSSProperties = {
    // boxSizing: "border-box",
    backgroundColor: "rgb(29 31 33 / 1)",
    // border: "2px solid #282a2e"
    boxShadow: "inset 0 0 0 2px #282a2e",
    MozBoxShadow: "inset 0 0 0 2px #282a2e",
    WebkitBoxShadow: "inset 0 0 0 2px #282a2e",
}



interface MenuProps {
    name: string
    onChangeName: (name: string) => void
}

export default function CodingMenu(props: MenuProps): ReactElement<MenuProps> {

    // const size = props.name.length > 5 ? props.name.length : 5;

    const nameInput : CSSProperties = {
        color: "white",
        backgroundColor: "rgb(21, 21, 21)",
        fontFamily: `Menlo, Monaco, "Courier New", monospace`,
        fontStretch: `expanded`,
        fontSize: `1rem`,
        border: "black",
        width: `13rem`,
    }

    return (<>
        <Navbar bg="d2ark" variant="dark" style={navStyle}>
            {/* <Link to="/"> */}
            <Navbar.Brand href="/">
                <span style={brandStyle}>Code Interview</span>
            </Navbar.Brand>
            {/* </Link> */}
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {/* <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav> 


                <Form inline>
                    <FormControl
                        style={nameInput}
                        type="text"
                        placeholder="Your name"
                        className="mr-sm-2"
                        value={props.name}
                        onChange={(e) => props.onChangeName(e.target.value)} />
                </Form>

            </Navbar.Collapse>
        </Navbar>
    </>);
}