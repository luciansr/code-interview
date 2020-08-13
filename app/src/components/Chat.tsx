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
    minWidth: "25rem",
    maxWidth:"25rem"
}

const inputStyle: CSSProperties = {
    alignSelf: "stretch",
    marginTop: "auto",
    padding: "1rem"
}

export default function Chat(props: ChatProps): ReactElement<ChatProps> {
    return (
        <>
            <div style={divStyle}>
                <div>
                    {props.messages.map(message => (<ChatMessageElement value={message} />))}
                </div>
                <div style={inputStyle}>
                    <InputGroup>
                        <FormControl
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                        />

                        <Button>Send</Button>
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