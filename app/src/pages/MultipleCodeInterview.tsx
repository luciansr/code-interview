import React, { ReactElement, useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import Chat from '../components/Chat';
import CodingMenu from '../components/CodingMenu';
import BottomNav from '../components/BottomNav';
import ReactGA from 'react-ga';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, ChatMessageData, ChatMessageType, CursorPositionData, UserCursorData } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();

export default function MultipleCodeInterview(): ReactElement {
    const [language, setLanguage] = useState<string>(`typescript`);
    const [editorMode, setEditorMode] = useState<string>(`vscode`);
    const [name, setName] = useState<string>(``);
    const [html, setHtml] = useState<string>(``);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [cursors, setCursors] = useState<UserCursorData[]>([]);

    const { interviewId } = useParams<{ interviewId: string }>();

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setHtml,
                receiveChatMessage: receiveChatMessage,
                receiveNameUpdate: receiveNameUpdate,
                receiveLanguageUpdate: setLanguage,
                receiveCursorData: receiveCursorData
            })

            setCommunicationManager(communicationManager);
            ReactGA.pageview(`/multiple-code-interview`);
        })();
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setHtml(code);
        if (communicationManager) {
            communicationManager.SendCodeUpdate(code)
        }
        ReactGA.event({
            category: 'Interaction',
            action: 'Update code'
          })
    }

    const onChangeEditorMode = (editorMode: string) => {
        setEditorMode(editorMode)
        ReactGA.event({
            category: 'Interaction',
            action: 'Change editor mode',
            label: editorMode
          })
    }

    const onChangeCursor = (cursor: CursorPositionData) => {
        if (communicationManager) {
            communicationManager.SendCursorUpdate(cursor)
        }
    }

    const receiveChatMessage = (messages: ChatMessageData[]) => {
        setMessages(messages)
    }

    const receiveCursorData = (cursors: UserCursorData[]) => {
        setCursors(cursors)
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
        ReactGA.event({
            category: 'Interaction',
            action: 'Send chat message',
            label: message
          })
    }

    const handleSetName = (name: string) => {
        setName(name)
        if (communicationManager) {
            communicationManager.SetName(name)
        }
        ReactGA.event({
            category: 'Interaction',
            action: `Changed name`,
            label: name
          })
    }

    const handleSetLanguage = (language: string) => {
        if (communicationManager) {
            communicationManager.SendLanguageUpdate(language)
        }
        setLanguage(language)
        ReactGA.event({
            category: 'Interaction',
            action: `Changed Language`,
            label: language
          })
    }

    return (<>
        <div className="wrapper">
            <div id="row1">
                <CodingMenu
                    name={name}
                    onChangeName={handleSetName}
                    language={language}
                    onChangeLanguage={handleSetLanguage}
                    editorMode={editorMode}
                    onChangeEditorMode={onChangeEditorMode} />
            </div>
            <div id="row2">
                <div id="col1">
                    <div id="col1-row1">
                        <CodeEditor
                            language={language}
                            mode={editorMode}
                            value={html}
                            cursors={cursors}
                            onChange={onChangeCode}
                            onCursorChange={onChangeCursor}
                        />
                    </div>
                    <div id="col1-row2">
                        <BottomNav emulateCode={true} />
                    </div>

                </div>
                <div id="col2"><Chat messages={messages} addTextMessage={addNewMessage} /></div>
            </div>
            <div id="row3">
            </div>
        </div>
    </>);
}