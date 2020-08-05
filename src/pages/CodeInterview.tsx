import React, { ReactElement, useState, useEffect } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';

import { useParams } from 'react-router-dom';

import { CodeService, Connection } from '../services/CodeService';

export default function CodeInterview(): ReactElement {
    const [html, setHtml] = useState<string>(`1`);
    const [loading, setLoading] = useState<boolean>(true);
    const [connection, setConnection] = useState<Connection>();


    const { interviewId } = useParams();

    const receiveData = (code: string) => {
        console.log(html)
        console.log(setHtml)
        setHtml(code);
    }


    useEffect(() => {
        // setHtml(`nao eh o felitche`)
        (async () => {
            const connection = await CodeService.getConnection(interviewId)

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
        <Jumbotron>
            {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
            <CodeEditor value={html} onChange={onChangeCode} />
        </Jumbotron>
    </>);
}