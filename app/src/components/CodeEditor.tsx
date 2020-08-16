import React, { useState, ReactElement, useEffect} from 'react'
import * as ace from 'ace-builds'

import AceEditor, { IAceOptions } from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

export default function CodeEditor(props: EditorProps): ReactElement<EditorProps> {
    return (
        <>
            <AceEditor
                mode={"javascript"}
                theme="monokai"
                value={props.value}
                placeholder={`// write your code here`}
                // debounceChangePeriod={600}
                setOptions={{
                    useWorker: false,
                    highlightActiveLine: true,
                    highlightSelectedWord: true,
                    showLineNumbers: true,
                    showPrintMargin: false,
                    hScrollBarAlwaysVisible: false,
                    vScrollBarAlwaysVisible: false,
                    showGutter: true,
                    fontSize: "0.8rem",
                    wrap: true
                }}
                width={"100%"}
                height={"100%"}
                onChange={props.onChange}
                name="code-editor"
                editorProps={{
                    $blockScrolling: true,
                    $highlightPending: true,
                    $highlightTagPending: true
                }}
            />
        </>
    )
}