import React, { ReactElement, CSSProperties } from 'react';

import { Button, Navbar, Nav, Form, FormControl, NavDropdown, ButtonGroup } from 'react-bootstrap';

// import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';


const navStyle: CSSProperties = {
    // boxSizing: "border-box",
    backgroundColor: "rgb(29 31 33 / 1)",
    // border: "2px solid #282a2e"
    boxShadow: "inset 0 0 0 2px #282a2e",
    MozBoxShadow: "inset 0 0 0 2px #282a2e",
    WebkitBoxShadow: "inset 0 0 0 2px #282a2e",
}

interface MenuProps {
    language: string
    onChangeLanguage: (language: string) => void


    editorMode: string
    onChangeEditorMode: (mode: string) => void

    name: string
    onChangeName: (name: string) => void
}

const nameInput: CSSProperties = {
    color: "#858585",
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
    fontStretch: `expanded`,
    fontSize: `0.8rem`,
}

const divStyle: CSSProperties = {
    marginRight: "1rem"
}

export default function BottomNav(props: MenuProps): ReactElement<MenuProps> {

    // const size = props.name.length > 5 ? props.name.length : 5;



    return (<>
        <Navbar expand="lg" variant="dark" style={navStyle}>
            <span style={nameInput}>Get in touch on </span>
        </Navbar>
    </>);
}