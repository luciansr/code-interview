import React, { useState, ReactElement, useEffect } from 'react'

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



export default function Chat(props: ChatProps): ReactElement<ChatProps> {
    return (
        <>
            <div>
                {props.messages.map(message => (<ChatMessageElement value={message} />))}
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
            <div>
                {props.value.message}
            </div>
        </>
    )
}