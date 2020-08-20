import React, { ReactElement, CSSProperties } from 'react';
import { fontFamily } from '../shared/Constants'

import { Navbar } from 'react-bootstrap';

import './BottomNav.css'
const navStyle: CSSProperties = {
    backgroundColor: "rgb(29 31 33 / 1)",
    borderTop: "2px dotted #282a2e"
}

interface MenuProps {
    emulateCode: boolean
}

const nameInput: CSSProperties = {
    color: "#858585",
    fontFamily: fontFamily,
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

    const nameInput: CSSProperties = {
        color: "#858585",
        fontFamily: fontFamily,
        fontStretch: `expanded`,
        fontSize: `0.8rem`,
        marginLeft: props.emulateCode? "42px" : undefined
    }

    return (<>
        <Navbar expand="lg" variant="dark" style={navStyle}>
            {!props.emulateCode || (<span style={blockStyle}></span>)}
            <span style={nameInput}>
                Contact me on <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin"
                    href="https://linkedin.com/in/luciansturiao">
                    LinkedIn
                    </a>, <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="email"
                    href="mailto:luciansturiao@gmail.com">
                    email
                    </a>, or <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github"
                    href="https://github.com/luciansr">
                    Github</a>.
            </span>

        </Navbar>
    </>);
}