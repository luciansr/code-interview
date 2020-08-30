import React, { ReactElement, useState, CSSProperties, useEffect } from 'react'
import { fontFamily } from '../../shared/Constants'

import CanvasDraw from "react-canvas-draw";


interface Props {
    value: CanvasState | undefined,
    onChange: (value: CanvasState) => void
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
    const [canvasRef, setCanvasRef] = useState<CanvasDraw>()
    const [enableUpdate, setEnableUpdate] = useState<boolean>(false)


    // useEffect(() => {
        
    //     setTimeout(() => {
    //         if(props.value && canvasRef) {
    //             canvasRef?.loadSaveData(JSON.stringify(props.value), true)
    //         }
    //     //     setEnableUpdate(true)
    //     }, 100)
    // }, [canvasRef])

    const onClear = () => {
        canvasRef?.clear()

    }

    const onSave = () => {
        var canvasHistory = canvasRef?.getSaveData()
        // debugger;
        console.log(canvasHistory)
        // canvas?.
        console.log(canvasRef?.state)
        // canvas?.loadSaveData(canvasHistory)
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
                    ref={(canvas: CanvasDraw) => {
                        setCanvasRef(canvas); 
                        if(props.value && canvas && !enableUpdate){
                            setEnableUpdate(true)
                            canvas.loadSaveData(JSON.stringify(props.value), false)
                        }                        
                    }}
                    onChange={(canvas: CanvasDraw) => props.onChange(JSON.parse(canvas.getSaveData()))}
                    brushColor={`lightpink`}
                    canvasHeight={`100%`}
                    canvasWidth={`100%`}
                />
            </div>
        </>
    )
}