import React, { ReactElement, CSSProperties } from 'react';

import { Button, Navbar, Nav, Form, FormControl, NavDropdown, ButtonGroup } from 'react-bootstrap';

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
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
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

export default function CodingMenu(props: MenuProps): ReactElement<MenuProps> {

    // const size = props.name.length > 5 ? props.name.length : 5;



    return (<>
        <Navbar bg="d2ark" variant="dark" style={navStyle}>
            {/* <Link to="/"> */}
            <Navbar.Brand href="/">
                <span style={brandStyle}>Coding Interview</span>
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

                <div style={divStyle}>
                    <Form inline>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Example select</Form.Label>
                            <Form.Control as="select" value={props.language} onChange={(e) => props.onChangeLanguage(e.target.value)}>
                                {languages.map(lang => (<option value={lang.value}>{lang.name}</option>))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
                <div style={divStyle}>
                    <ButtonGroup aria-label="Basic example">
                        {modes.map(mode =>
                            (<Button
                                onClick={() => props.onChangeEditorMode(mode.value)}
                                variant={`${(mode.value === props.editorMode ? "" : "outline-")}secondary`}>
                                {mode.name}</Button>))}
                    </ButtonGroup>
                </div>

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