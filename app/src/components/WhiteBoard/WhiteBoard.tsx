import React, { ReactElement } from 'react'
import { fontFamily } from '../../shared/Constants'

import CanvasDraw from "react-canvas-draw";


interface Props {

}

export default function WhiteBoard(props: Props): ReactElement<Props> {
    return (
        <>
            <div style={{ width: "100%", height: "100%" }}>
                <CanvasDraw 
                    backgroundColor={`rgb(29, 31, 33)`}
                    lazyRadius={3}
                    brushRadius={2}

                    brushColor={`lightpink`}
                    canvasHeight={`100%`}
                    canvasWidth={`100%`}
                />
            </div>
        </>
    )
}