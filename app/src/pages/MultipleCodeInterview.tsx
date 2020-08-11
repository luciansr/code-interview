import React, { ReactElement, useState, useEffect } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';
import Menu from '../components/Menu';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, CommunicationManager, MessageType, DataMessage } from '../services';

import './MultipleCodeInterview.css'

const connectionService = new MultipleConnectionService();


export default function MultipleCodeInterview(): ReactElement {
    const [html, setHtml] = useState<string>(`1`);
    const [loading, setLoading] = useState<boolean>(true);
    const [communicationManager, setCommunicationManager] = useState<CommunicationManager>();


    const { interviewId } = useParams();

    const receiveCode = (code: string) => {
        console.log(html)
        console.log(setHtml)
        setHtml(code);
    }


    useEffect(() => {
        (async () => {
            const communicationManager = await connectionService.getConnection(interviewId, {
                receiveCodeUpdate: receiveCode
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

    return (<>
        <Menu/>
        <Jumbotron>
            {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
            <CodeEditor value={html} onChange={onChangeCode} />
        </Jumbotron>
    </>);
}