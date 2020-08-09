import React, { ReactElement } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import Menu from '../components/Menu';

import { useHistory } from 'react-router-dom';

import { CodeService } from '../services/CodeService';

export default function Home(): ReactElement {
    let history = useHistory();

    const getCodeInterviewCode = async () => {
        const code = await CodeService.getNewInterviewCode();
        history.push(`/mc/${code}`);
    }

    getCodeInterviewCode()

    return (<>
        <Menu/>
        <Jumbotron>
            <h1>Hello, world!</h1>
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