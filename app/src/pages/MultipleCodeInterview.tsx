import React, { ReactElement, useState, useEffect, CSSProperties } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';
// import MonacoCodeEditor from '../components/MonacoCodeEditor';
import Chat from '../components/Chat';
import CodingMenu from '../components/CodingMenu';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, ChatMessageData, ChatMessageType } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();


export default function MultipleCodeInterview(): ReactElement {
    const [language, setLanguage] = useState<string>(`typescript`);
    const [editorMode, setEditorMode] = useState<string>(`vscode`);
    const [name, setName] = useState<string>(``);
    const [html, setHtml] = useState<string>(``);
    const [loading, setLoading] = useState<boolean>(true);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);

    const { interviewId } = useParams();

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setHtml,
                receiveChatMessage: receiveChatMessage,
                receiveNameUpdate: receiveNameUpdate,
                receiveLanguageUpdate: setLanguage
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

    const receiveNameUpdate = (name: string) => {
        setName(name)
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
        addNewMessageHandler(name, message)

        if (communicationManager) {
            communicationManager.SendChatMessage(name, message)
        }
    }

    const handleSetName = (name: string) => {
        setName(name)
        if (communicationManager) {
            communicationManager.SetName(name)
        }
    }

    const handleSetLanguage = (language: string) => {
        if (communicationManager) {
            communicationManager.SendLanguageUpdate(language)
        }
        setLanguage(language)
    }

    return (<>
        <CodingMenu
            name={name}
            onChangeName={handleSetName}
            language={language}
            onChangeLanguage={handleSetLanguage}
            editorMode={editorMode}
            onChangeEditorMode={setEditorMode} />

        {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
        <div style={divStyle}>
            <CodeEditor language={language} mode={editorMode} value={html} onChange={onChangeCode} />
            <Chat messages={messages} addTextMessage={addNewMessage} />
        </div>

    </>);
}