import React, { ReactElement, CSSProperties } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import Menu from '../components/Menu/Menu';
import BottomNav from '../components/BottomNav/BottomNav';

import { useHistory } from 'react-router-dom';

import { MultipleConnectionService } from '../services/MultipleConnectionService';
import './Home.css'


const connectionService = new MultipleConnectionService();
const colorBlack: CSSProperties = {
    color: "black"
}
export default function Home(): ReactElement {
    const history = useHistory();

    const getCodeInterviewCode = async () => {
        const code = await connectionService.getNewInterviewCode();
        history.push(`/m/c/${code}`);
    }

    getCodeInterviewCode()

    return (<>


        <div className="home-wrapper">
            <div id="home-row1">
                <Menu />
            </div>
            <div id="home-row2">

                <Jumbotron>
                    <h1 style={colorBlack}>It's gonna be Legen... wait for it!</h1>
                    <p style={colorBlack}>
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