import React, { ReactElement, useState, useEffect } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';
import Menu from '../components/Menu';

import { useParams } from 'react-router-dom';

import { MultipleConnectionService, MultipleConnection } from '../services';
const connectionService = new MultipleConnectionService();

export default function MultipleCodeInterview(): ReactElement {
    const [html, setHtml] = useState<string>(`1`);
    const [loading, setLoading] = useState<boolean>(true);
    const [connection, setConnection] = useState<MultipleConnection>();


    const { interviewId } = useParams();

    const receiveData = (code: string) => {
        console.log(html)
        console.log(setHtml)
        setHtml(code);
    }


    useEffect(() => {
        // setHtml(`nao eh o felitche`)
        (async () => {
            const connection = await connectionService.getConnection(interviewId)

            connection.onReceiveData((data) => {
                receiveData(data);
            });

            setConnection(connection);
            setLoading(false)
        })();
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setHtml(code);
        if (connection) {
            connection.sendMessage(code);
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