import React, { useState, ReactElement, useEffect } from 'react'
import * as ace from 'ace-builds'

import AceEditor, { IAceOptions } from "react-ace";

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-min-noconflict/mode-java";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/mode-c_cpp";
import "ace-builds/src-min-noconflict/mode-csharp";
import "ace-builds/src-min-noconflict/mode-golang";


import 'ace-builds/src-min-noconflict/keybinding-vscode';
import 'ace-builds/src-min-noconflict/keybinding-vim';

import "ace-builds/src-min-noconflict/theme-tomorrow_night";

import "ace-builds/src-min-noconflict/ext-language_tools"

interface EditorProps {
    language: string
    mode: string
    value: string
    onChange: (value: string) => void
}

export default function CodeEditor(props: EditorProps): ReactElement<EditorProps> {
    return (
        <>
            <AceEditor
                mode={props.language.toLowerCase()}
                theme="tomorrow_night"
                value={props.value}
                enableLiveAutocompletion={true}
                placeholder={`// write your code here`}
                highlightActiveLine={true}
                showPrintMargin={false}
                enableBasicAutocompletion={true}
                enableSnippets={true}
                // debounceChangePeriod={600}
                keyboardHandler={props.mode.toLowerCase()}
                onValidate={(data) => console.log(data)}
                setOptions={{
                    showInvisibles: true,
                    useWorker: false,
                    highlightActiveLine: true,
                    highlightSelectedWord: true,
                    showLineNumbers: true,
                    showPrintMargin: false,
                    hScrollBarAlwaysVisible: false,
                    vScrollBarAlwaysVisible: false,
                    showGutter: true,
                    fontSize: "0.9rem",
                    wrap: true,
                    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,

                }}
                width={"100%"}
                height={"100%"}
                onChange={props.onChange}
                name="code-editor"
                editorProps={{
                    $blockScrolling: true,
                    $highlightPending: true,
                    $highlightTagPending: true,

                }}
            />
        </>
    )
}