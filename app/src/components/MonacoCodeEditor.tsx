import React, { ReactElement, useState } from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

// import ReactResizeDetector from 'react-resize-detector';

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

export default function MonacoCodeEditor(props: EditorProps): ReactElement<EditorProps> {

    // const handleEditorChange = (ev: any, value: string | undefined) => {
    //     props.onChange(value || ``);
    // };

    // const [height, setHeight] = useState<number>(0)
    // const [width, setWidth] = useState<number>(0)

    return (
        <>
            <div
                className="editor-container"
                style={{ height: '100%', width: "100%" }}>
                {/* <ReactResizeDetector
                    handleWidth
                    handleHeight
                    onResize={(width: number, height: number) => {
                        setWidth(width)
                        setHeight(height)
                    }}
                    refreshMode="throttle"
                    refreshRate={100} /> */}
                <MonacoEditor
                    width={"100%"}
                    height={"100%"}
                    language="typescript"
                    theme="vs-dark"
                    value={props.value}
                    options={{
                        codeLens: true,
                        // automaticLayout: true,
                    }}
                    onChange={props.onChange}
                />
            </div>

        </>
    )
}