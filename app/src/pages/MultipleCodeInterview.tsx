import React, { ReactElement, useState, useEffect, CSSProperties } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';
// import MonacoCodeEditor from '../components/MonacoCodeEditor';
import Chat from '../components/Chat';
import Menu from '../components/Menu';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, ChatMessageData, ChatMessageType } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();


export default function MultipleCodeInterview(): ReactElement {
    const [html, setHtml] = useState<string>(``);
    const [loading, setLoading] = useState<boolean>(true);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessageData[]>([
        {
            message: `test message`,
            type: ChatMessageType.Own,
            from: `Lucian`
        }, {
            message: `test message 2`,
            type: ChatMessageType.Own,
            from: `Lucian`
        }, {
            message: `Answer message 2`,
            type: ChatMessageType.Others,
            from: `Rodrigues`
        }, {
            message: `Another answer`,
            type: ChatMessageType.Others,
            from: `Rodrigues`
        }
    ]);

    const { interviewId } = useParams();

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setHtml,
                receiveChatMessage: receiveChatMessage
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

    const receiveChatMessage = (messages: ChatMessageData[]) => {
        setMessages(messages)
    }

    const addNewMessageHandler = (from: string, message: string) => {
        setMessages([...messages,
            {
                message: message,
                type: ChatMessageType.Own,
                from: from
            }])
    }

    const addNewMessage = (message: string) => {
        addNewMessageHandler(`Lucian`, message)

        if (communicationManager) {
            communicationManager.SendChatMessage(message)
        }
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