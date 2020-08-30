import React, { ReactElement, useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import WhiteBoard, {CanvasState} from '../components/WhiteBoard/WhiteBoard';
import Chat from '../components/Chat/Chat';
import CodingMenu, { InterviewMode } from '../components/CodingMenu/CodingMenu';
import BottomNav from '../components/BottomNav/BottomNav';

import { Switch, Route, useParams, useHistory } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, ChatMessageData, ChatMessageType } from '../services/MultipleConnectionService';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();

export default function MultipleCodeInterview(): ReactElement {
    const { interviewId, interviewModeParam } = useParams();

    const [language, setLanguage] = useState<string>(`typescript`);
    const [editorMode, setEditorMode] = useState<string>(`vscode`);
    const [name, setName] = useState<string>(``);
    const [code, setCode] = useState<string>(``);

    const [canvasState, setCanvasState] = useState<CanvasState>();

    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [interviewMode, setInterviewMode] = useState<InterviewMode>(
        interviewModeParam === `c`? 
        InterviewMode.Coding: 
        InterviewMode.WhiteBoard);

    const history = useHistory();


    const goToCodeInterviewMode = () => history.push(`/m/c/${interviewId}`);
    const goToBoardInterviewMode = () => history.push(`/m/b/${interviewId}`);

    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: setCode,
                receiveChatMessage: receiveChatMessage,
                receiveNameUpdate: receiveNameUpdate,
                receiveLanguageUpdate: setLanguage
            })

            setCommunicationManager(communicationManager);
        })();
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setCode(code);
        if (communicationManager) {
            communicationManager.SendCodeUpdate(code)
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

    const handleChangeInterviewMode = (interviewMode: InterviewMode) => {
        switch(interviewMode) {
            case InterviewMode.Coding:
                goToCodeInterviewMode();
                break;
            case InterviewMode.WhiteBoard:
                goToBoardInterviewMode();
                break;
        }

        setInterviewMode(interviewMode);
    }

    return (<>
        <div className="wrapper">
            <div id="row1">
                <CodingMenu
                    interviewMode={interviewMode}
                    onChangeInterviewMode={handleChangeInterviewMode}
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
                        <Switch>
                            <Route path="/m/c/:interviewId">

                                <CodeEditor language={language} mode={editorMode} value={code} onChange={onChangeCode} />
                            </Route>
                            <Route path="/m/b/:interviewId">

                                <WhiteBoard value={canvasState} onChange={setCanvasState} />
                            </Route>

                        </Switch>

                    </div>
                    <div id="col1-row2">
                        <BottomNav emulateCode={interviewMode == InterviewMode.Coding} />
                    </div>

                </div>
                <div id="col2"><Chat messages={messages} addTextMessage={addNewMessage} /></div>
            </div>
            <div id="row3">
            </div>
        </div>
    </>);
}