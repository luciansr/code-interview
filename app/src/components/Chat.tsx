import React, { useState, ReactElement, useEffect, CSSProperties } from 'react'
import { FormControl, InputGroup, Button } from 'react-bootstrap';

export enum ChatMessageType {
    Text
}

export interface ChatMessage {
    type: ChatMessageType
    message: string
}

interface ChatProps {
    messages: ChatMessage[]
    addTextMessage: (text: string) => void
}



const divStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    minWidth: "25rem",
    maxWidth: "25rem"
}

const innerStyle: CSSProperties = {
    overflowY:"auto"
}

const inputStyle: CSSProperties = {
    alignSelf: "stretch",
    marginTop: "auto",
    padding: "1rem"
}

export default function Chat(props: ChatProps): ReactElement<ChatProps> {
    const [message, setMessage] = useState<string>(`test`)

    const onKeyPress = (target: any) => {
        if (target.charCode == 13) {
            sendMessage()
        }
    }

    const sendMessage = () => {
        props.addTextMessage(message);
        setMessage(``)
    }

    return (
        <>
            <div style={divStyle}>
                <div style={innerStyle}>
                    {props.messages.map(message => (<ChatMessageElement value={message} />))}
                </div>
                <div style={inputStyle}>
                    <InputGroup>
                        <FormControl
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={onKeyPress}
                            placeholder="Send your message"
                            aria-label="Type your message"
                            aria-describedby="basic-addon2"
                        />

                        <Button onClick={() => sendMessage()}>Send</Button>
                    </InputGroup>
                </div>
            </div>
        </>
    )
}

interface ChatMessageProps {
    value: ChatMessage
}


function ChatMessageElement(props: ChatMessageProps): ReactElement<ChatMessageProps> {
    return (
        <>
            <div >
                {props.value.message}
            </div>
        </>
    )
}