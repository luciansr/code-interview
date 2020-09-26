import React, { ReactElement /* , useEffect */ } from 'react'
import { fontFamily } from '../../shared/Constants'
import { CursorPositionData } from '../../services/MultipleConnectionService'
// import * as ace from 'ace-builds/src-noconflict/ace'

import AceEditor, { IMarker } from "react-ace";
// import brace from 'brace';
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/snippets/javascript";
import "ace-builds/src-min-noconflict/mode-typescript";
// import "ace-builds/src-min-noconflict/snippets/typescript";
import "ace-builds/src-min-noconflict/mode-java";
// import "ace-builds/src-min-noconflict/snippets/java";
import "ace-builds/src-min-noconflict/mode-python";
// import "ace-builds/src-min-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/mode-c_cpp";
// import "ace-builds/src-min-noconflict/snippets/c_cpp";
import "ace-builds/src-min-noconflict/mode-csharp";
// import "ace-builds/src-min-noconflict/snippets/csharp";
import "ace-builds/src-min-noconflict/mode-golang";
// import "ace-builds/src-min-noconflict/snippets/golang";


import 'ace-builds/src-min-noconflict/keybinding-vscode';
import 'ace-builds/src-min-noconflict/keybinding-vim';

import "ace-builds/src-min-noconflict/theme-tomorrow_night";

import "ace-builds/src-min-noconflict/ext-language_tools"

import "./CodeEditor.css"

interface EditorProps {
    language: string
    mode: string
    value: string
    cursors: CursorPositionData[]
    onChange: (value: string) => void
    onCursorChange: (value: CursorPositionData) => void
}

export default function CodeEditor(props: EditorProps): ReactElement<EditorProps> {
    const { cursors } = props;

    const cursorMarkers: IMarker[] = cursors.map(cursor => {
        return {
            startRow: cursor.lead.row,
            startCol: cursor.lead.column,
            endRow: cursor.lead.row,
            endCol: cursor.lead.column + 1,
            type: "text",
            className: "cursor-marker"
        }
    })

    const cursorMarkersAndLines: IMarker[] = cursorMarkers.concat(cursors.map(cursor => {
        return {
            startRow: cursor.lead.row,
            startCol: 0,
            endRow: cursor.lead.row,
            endCol: 1,
            type: "fullLine",
            className: "cursor-line"
        }
    }))

    const onCursorChange = (selection: CursorPositionData) => {
        props.onCursorChange({
            anchor: {
                column: selection.anchor.column,
                row: selection.anchor.row
            },
            lead: {
                column: selection.lead.column,
                row: selection.lead.row
            }
        })
    }

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
                keyboardHandler={props.mode.toLowerCase()}
                markers={cursorMarkersAndLines}
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
                    fontFamily: fontFamily,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                }}
                width={"100%"}
                height={"100%"}
                onChange={props.onChange}
                onSelectionChange={onCursorChange}
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