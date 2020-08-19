import React, { ReactElement, CSSProperties } from 'react';

import { Navbar } from 'react-bootstrap';

const brandStyle: CSSProperties = {
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
    fontWeight: 700,
    fontSize: "1.1rem",
}

const navStyle: CSSProperties = {
    backgroundColor: "rgb(29 31 33 / 1)",
    boxShadow: "inset 0 0 0 2px #282a2e",
    MozBoxShadow: "inset 0 0 0 2px #282a2e",
    WebkitBoxShadow: "inset 0 0 0 2px #282a2e",
}

export default function Menu(): ReactElement {
    return (<>
        <Navbar bg="d2ark" variant="dark" style={navStyle}>
            <Navbar.Brand href="/"><span style={brandStyle}>Coding Interview</span></Navbar.Brand>
        </Navbar>
    </>);
}