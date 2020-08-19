import React, { ReactElement, CSSProperties } from 'react';

import { Navbar } from 'react-bootstrap';

import './BottomNav.css'
const navStyle: CSSProperties = {
    backgroundColor: "rgb(29 31 33 / 1)",
    borderTop: "2px dotted #282a2e"
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
    marginLeft: "42px"
}

const blockStyle: CSSProperties = {
    width: "42px",
    height: "100%",
    backgroundColor: "#26282d",
    position: "absolute",
    left: "0"
}

export default function BottomNav(props: MenuProps): ReactElement<MenuProps> {
  
    return (<>
        <Navbar expand="lg" variant="dark" style={navStyle}>
            <span style={blockStyle}></span>
            <span style={nameInput}>
                Get in touch on <a
                target="_blank"
                    className="linkedin"
                    href="https://linkedin.com/in/luciansturiao">
                    LinkedIn
                    </a>, <a
                    target="_blank"
                    className="email"
                    href="mailto:luciansturiao@gmail.com">
                    e-mail
                    </a>, or <a
                    target="_blank"
                    className="github"
                    href="https://github.com/luciansr">
                    Github</a>
            </span>

        </Navbar>
    </>);
}