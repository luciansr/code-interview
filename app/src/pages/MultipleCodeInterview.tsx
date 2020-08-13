import React, { ReactElement, useState, useEffect, CSSProperties } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';
import Chat, { ChatMessage, ChatMessageType } from '../components/Chat';
import Menu from '../components/Menu';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();


export default function MultipleCodeInterview(): ReactElement {
    const [html, setHtml] = useState<string>(``);
    const [loading, setLoading] = useState<boolean>(true);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            message: `test message`,
            type: ChatMessageType.Text
        },{
            message: `test message`,
            type: ChatMessageType.Text
        }
    ]);

    const { interviewId } = useParams();

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setHtml
            })

            setCommunicationManager(communicationManager);
            setLoading(false)
        })();
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setHtml(code);
        if (communicationManager) {
            communicationManager.SendCodeUpdate(code)
        }
    }

    const divStyle: CSSProperties = {
        display: "flex",
        width: "100%",
        height: "calc(100% - 3.5rem)",
        maxHeight: "calc(100% - 3.5rem)",
    }

    const addNewMessage = (message: string) => {
        setMessages(messages.concat([
            {
                message: message,
                type: ChatMessageType.Text
            }
        ]))
    }

    return (<>
        <Menu />
        {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
        <div style={divStyle}>
            <CodeEditor value={html} onChange={onChangeCode} />
            <Chat messages={messages} addTextMessage={addNewMessage} />
        </div>

    </>);
}