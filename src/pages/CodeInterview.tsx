import React, { ReactElement, useEffect, useState } from 'react';
import { Jumbotron, Container, Button, ButtonToolbar, Navbar } from 'react-bootstrap';

import { BrowserRouter, Switch, Route, Link, useParams, useHistory } from 'react-router-dom';

import { CodeService } from '../services/CodeService';

export default function CodeInterview(): ReactElement {
    let history = useHistory();
    const { interviewId } = useParams();

    const getCodeInterviewCode = async () => {
        const code = await CodeService.GetNewCodeInterviewCode();
        history.push(`/c/${code}`);
    }

    return (<>
        <Jumbotron>
            <h1>Hello, world! Code Interview Id = {interviewId} </h1>
            <p>
                This is a simple hero unit, a simple jumbotron-style component for calling
                extra attention to featured content or information.
            </p>
            <p>
                <Button variant="primary" onClick={getCodeInterviewCode}>New Code Interview</Button>
            </p>
        </Jumbotron>
    </>);
}