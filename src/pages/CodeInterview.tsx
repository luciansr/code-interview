import React, { ReactElement, useState, useEffect } from 'react';
import { Jumbotron, Spinner } from 'react-bootstrap';
import CodeEditor from '../components/CodeEditor';

import { useParams } from 'react-router-dom';

import { CodeService } from '../services/CodeService';

export default function CodeInterview(): ReactElement {
    var [code, setCode] = useState<string>(``);
    var [loading, setLoading] = useState<boolean>(true);

    const { interviewId } = useParams();

    useEffect(() => {
        if(CodeService.isItMyId(interviewId)) {

        } else {

        }
    }, [interviewId])

    return (<>
        <Jumbotron>
            {!loading || (<><h1> Waiting connection ... </h1> <Spinner animation="border" /></>)}
            
            <p>
                <CodeEditor value={code} onChange={setCode} />
            </p>
        </Jumbotron>
    </>);
}