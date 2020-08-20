import React, { ReactElement, CSSProperties } from 'react';

import { fontFamily } from '../shared/Constants'
import { Button, Navbar, Nav, Form, FormControl, ButtonGroup } from 'react-bootstrap';
import './CodingMenu.css'

const brandStyle: CSSProperties = {
    fontFamily: fontFamily,
    fontWeight: 700,
    fontSize: "1.1rem",
}

const navStyle: CSSProperties = {
    backgroundColor: "rgb(29 31 33 / 1)",
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
    color: "white",
    backgroundColor: "rgb(21, 21, 21)",
    fontFamily: fontFamily,
    fontStretch: `expanded`,
    fontSize: `1rem`,
    border: "black",
    width: `13rem`,
}

const divStyle: CSSProperties = {
    marginRight: "1rem"
}

interface KeyValue {
    name: string
    value: string
}

const languages: KeyValue[] = [
    {
        name: "TypeScript",
        value: "typescript"
    },
    {
        name: "JavaScript",
        value: "javascript"
    },
    {
        name: "C#",
        value: "csharp"
    },
    {
        name: "C++",
        value: "c_cpp"
    },
    {
        name: "Python",
        value: "python"
    },
    {
        name: "Java",
        value: "java"
    },
    {
        name: "Golang",
        value: "golang"
    }
]

const modes: KeyValue[] = [
    {
        name: "VSCode",
        value: "vscode"
    },
    {
        name: "Vim",
        value: "vim"
    }
]

const font: CSSProperties = {
    fontFamily: fontFamily
}

export default function CodingMenu(props: MenuProps): ReactElement<MenuProps> {
    return (<>
        <Navbar variant="dark" style={navStyle}>
            <Navbar.Brand href="/">
                <span style={brandStyle}>Coding Interview</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">

                </Nav>

                <div style={divStyle} className="disappear-on-phones">
                    <Form inline>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select" value={props.language} onChange={(e) => props.onChangeLanguage(e.target.value)}>
                                {languages.map(lang => (<option
                                    key={lang.value}
                                    style={font}
                                    value={lang.value}>{lang.name}</option>))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
                <div style={divStyle} className="disappear-on-phones disappear-on-tablets">
                    <ButtonGroup aria-label="Basic example">
                        {modes.map(mode =>
                            (<Button
                                style={font}
                                key={mode.value}
                                onClick={() => props.onChangeEditorMode(mode.value)}
                                variant={`${(mode.value === props.editorMode ? "" : "outline-")}secondary`}>
                                {mode.name}</Button>))}
                    </ButtonGroup>
                </div>

                <div className="disappear-on-phones">

                    <Form inline >

                        <FormControl
                            style={nameInput}
                            type="text"
                            placeholder="Your name"
                            className="disappear-on-phones mr-sm-2"
                            value={props.name}
                            onChange={(e) => props.onChangeName(e.target.value)} />
                    </Form>
                </div>

            </Navbar.Collapse>
        </Navbar>
    </>);
}