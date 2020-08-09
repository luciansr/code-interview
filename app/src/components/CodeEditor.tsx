import React, { useState, ReactElement, useEffect} from 'react'
import * as ace from 'ace-builds'

import AceEditor, { IAceOptions } from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

export default function CodeEditor(props: EditorProps): ReactElement<EditorProps> {
    return (
        <>
            <AceEditor
                mode={"javascript"}
                theme="github"
                value={props.value}
                // debounceChangePeriod={600}
                setOptions={{
                    useWorker: false,
                    highlightActiveLine: true,
                    highlightSelectedWord: true,
                    showLineNumbers: true,
                    showPrintMargin: false,
                    hScrollBarAlwaysVisible: true,
                    vScrollBarAlwaysVisible: true,
                    showGutter: true
                }}
                width={"auto"}
                height={"70%"}
                onChange={props.onChange}
                name="my_id"
                editorProps={{
                    $blockScrolling: true,
                    $highlightPending: true,
                    $highlightTagPending: true
                }}
            />
        </>
    )
}