import React, { useState, ReactElement, CSSProperties } from 'react'
import { InputGroup, Button } from 'react-bootstrap';
import {ChatMessageData} from '../../services/MultipleConnectionService'
import {fontFamily} from '../../shared/Constants'
import './Chat.css'


interface ChatProps {
    messages: ChatMessageData[]
    addTextMessage: (text: string) => void
}

const chatStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: "100%",
    maxWidth: "25rem",
    padding: "0.8rem 1rem",
    backgroundColor: "#151515"
}

const innerStyle: CSSProperties = {
    overflowY: "auto"
}

const inputStyle: CSSProperties = {
    alignSelf: "stretch",
    marginTop: "auto",
    padding: "0rem"
}

const textAreaStyle: CSSProperties = {
    resize: "none",
    alignSelf: "stretch",
    flex: "10 1",
    // width: "100vw",
    padding: "0.5rem",
    color: "white",
    backgroundColor:"#1d1f21",
    fontFamily: fontFamily,
    fontSize: `0.8rem`,
    borderRadius: `0.3rem`
}

const buttonStyle: CSSProperties = {
    position: "absolute",
    right: "0.5rem",
    borderRadius: `0.3rem`,
    bottom: "0.5rem",
    fontFamily: fontFamily,
    fontSize: `0.8rem`,
    backgroundColor: "gray",
    borderColor: "gray"
}

export default function Chat(props: ChatProps): ReactElement<ChatProps> {
    const [message, setMessage] = useState<string>(``)

    const onKeyPress = (target: any) => {
        if (target.charCode === 13) {
            sendMessage()
        }
    }

    const sendMessage = () => {
        props.addTextMessage(message);
        setMessage(``)
    }

    return (
        <>
            <div style={chatStyle} id="chatWrapper">
                <div style={innerStyle}>
                    {props.messages.map(message => (<ChatMessageElement key={`${message.from}:${message.message}`} value={message} />))}
                </div>
                <div style={inputStyle}>
                    <InputGroup>
                        <textarea
                            style={textAreaStyle}
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={onKeyPress}
                            placeholder="Send your message"
                            aria-label="Type your message"
                            aria-describedby="basic-addon2"
                        />

                        <Button style={buttonStyle} variant="dark"  onClick={() => sendMessage()}>Send</Button>
                    </InputGroup>
                </div>
            </div>
        </>
    )
}

interface ChatMessageProps {
    value: ChatMessageData
}

const messageSytle: CSSProperties = {
    margin: "0.1rem 0",
    fontFamily: fontFamily,
    color: "white",
    fontSize: `0.8rem`
}

const nameSytle: CSSProperties = {
    fontWeight: 600
}

function ChatMessageElement(props: ChatMessageProps): ReactElement<ChatMessageProps> {
    return (
        <>
            <div style={messageSytle}>
                <span style={nameSytle}>{props.value.from}:</span> <span>{props.value.message}</span>
            </div>
        </>
    )
}