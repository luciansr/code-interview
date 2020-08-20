import React, { ReactElement, CSSProperties } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import Menu from '../components/Menu';
import BottomNav from '../components/BottomNav';

import { fontFamily } from '../shared/Constants'

import { useHistory } from 'react-router-dom';

import { MultipleConnectionService } from '../services/MultipleConnectionService';
import './Home.css'


const connectionService = new MultipleConnectionService();
const jumboStyle: CSSProperties = {
    fontFamily: fontFamily
}
export default function Home(): ReactElement {
    let history = useHistory();

    const getCodeInterviewCode = async () => {
        const code = await connectionService.getNewInterviewCode();
        history.push(`/mc/${code}`);
    }

    getCodeInterviewCode()

    return (<>


        <div className="home-wrapper">
            <div id="home-row1">
                <Menu />
            </div>
            <div id="home-row2">

                <Jumbotron>
                    <h1>Hey, there!</h1>
                    <p>
                        Your are not supposed to be here
                    </p>
                    <p>
                        <Button variant="dark" onClick={getCodeInterviewCode}>Create Coding Interview Room</Button>
                    </p>

                </Jumbotron>
            </div>
            <div id="home-row3">
                <BottomNav emulateCode={false} />
            </div>
        </div>
    </>);
}