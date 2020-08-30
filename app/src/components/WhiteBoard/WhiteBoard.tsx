import React, { ReactElement } from 'react'
import {fontFamily} from '../../shared/Constants'


interface Props {
 
}

export default function WhiteBoard(props: Props): ReactElement<Props> {
    return (
        <>
            <div style={{width: "100%", height: "100%"}}></div>
        </>
    )
}