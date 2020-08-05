import React, { ReactElement, useState, useEffect } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';

import { useParams } from 'react-router-dom';

import { CodeService, Connection } from '../services/CodeService';

export default function CodeInterview(): ReactElement {
    var [code, setCode] = useState<string>(``);
    var [loading, setLoading] = useState<boolean>(true);
    var [connection, setConnection] = useState<Connection>();


    const { interviewId } = useParams();

    const receiveData = (code: string) => {
        setCode(code);
    }

    useEffect(() => {
        (async () => {
            const connection = await CodeService.getConnection(interviewId, receiveData)

            setConnection(connection);
            setLoading(false)
        })();    
    }, [interviewId])

    const onChangeCode = (code: string) => {
        setCode(code);
        if(connection) {
            connection.sendMessage(code);
        }
    }



    return (<>
        <Jumbotron>
            {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
            

                <CodeEditor value={code} onChange={onChangeCode} />

        </Jumbotron>
    </>);
}