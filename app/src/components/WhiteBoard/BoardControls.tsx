import React, { ReactElement, useState, CSSProperties } from 'react'
import { fontFamily } from '../../shared/Constants'

interface Props {

}

const saveButton: CSSProperties = {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 20
}

export default function BoardControls(props: Props): ReactElement<Props> {
    
    return (
        <>
            <div style={{ width: "100%", height: "100%" }}>
                <button style={saveButton} className="btn">Save</button>
                
            </div>
        </>
    )
}