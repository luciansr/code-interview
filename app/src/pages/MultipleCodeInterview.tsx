import React, { ReactElement, useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import Chat from '../components/Chat';
import CodingMenu from '../components/CodingMenu';
import BottomNav from '../components/BottomNav';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, ChatMessageData, ChatMessageType, CursorPositionData } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();

export default function MultipleCodeInterview(): ReactElement {
    const [language, setLanguage] = useState<string>(`typescript`);
    const [editorMode, setEditorMode] = useState<string>(`vscode`);
    const [name, setName] = useState<string>(``);
    const [html, setHtml] = useState<string>(``);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);

    const { interviewId } = useParams<{ interviewId: string }>();

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setHtml,
                receiveChatMessage: receiveChatMessage,
                receiveNameUpdate: receiveNameUpdate,
                receiveLanguageUpdate: setLanguage
            })

            setCommunicationManager(communicationManager);
        })();
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setHtml(code);
        if (communicationManager) {
            communicationManager.SendCodeUpdate(code)
        }
    }

    const onChangeCursor = (cursor: CursorPositionData) => {
        // setHtml(code);
        if (communicationManager) {
            communicationManager.SendCursorUpdate(cursor)
        }
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
        <div className="wrapper">
            <div id="row1">
                <CodingMenu
                    name={name}
                    onChangeName={handleSetName}
                    language={language}
                    onChangeLanguage={handleSetLanguage}
                    editorMode={editorMode}
                    onChangeEditorMode={setEditorMode} />
            </div>
            <div id="row2">
                <div id="col1">
                    <div id="col1-row1">
                        <CodeEditor
                            language={language}
                            mode={editorMode}
                            value={html}
                            cursors={[{
                                anchor: {
                                    column: 2,
                                    row: 3
                                },
                                lead: {
                                    column: 1,
                                    row: 0
                                }
                            }]}
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