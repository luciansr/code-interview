import React, { ReactElement, useState, CSSProperties } from 'react'
import { fontFamily } from '../../shared/Constants'

import CanvasDraw from "react-canvas-draw";


interface Props {

}

export interface CanvasState {
    height:string
    width: string
    lines: CanvasLine[]
}

interface CanvasLine {
    brushColor: string
    brushRadius: number
    points: CanvasLinePoint[]
}

interface CanvasLinePoint {
    x: number
    y: number
}

const controlDiv: CSSProperties = {
    position: "absolute",
    zIndex: 20
}

const saveButton: CSSProperties = {
    zIndex: 20
}

export default function WhiteBoard(props: Props): ReactElement<Props> {
    const [canvas, setCanvas] = useState<CanvasDraw>()

    const onClear = () => {
        canvas?.clear()

    }

    const onSave = () => {
        var canvasHistory = canvas?.getSaveData()
        debugger;
        console.log(canvasHistory)
    }

    return (
        <>
            <div style={{ width: "100%", height: "100%" }}>
                <div style={controlDiv}>

                    <button style={saveButton} className="btn btn-danger" onClick={onClear}>Clear</button>
                    <button style={saveButton} className="btn btn-success" onClick={onSave}>Save</button>
                </div>
                <CanvasDraw
                    backgroundColor={`rgb(29, 31, 33)`}
                    lazyRadius={3}
                    brushRadius={2}
                    ref={(canvas: CanvasDraw) => setCanvas(canvas)}
                    onChange={(canvas: CanvasDraw) => console.log(canvas)}
                    brushColor={`lightpink`}
                    canvasHeight={`100%`}
                    canvasWidth={`100%`}
                />
            </div>
        </>
    )
}