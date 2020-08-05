import React, { useState, ReactElement, useEffect} from 'react'

import AceEditor, { IAceOptions } from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";

interface EditorProps {
    value: string
    onChange?: (value: string) => void
}

export default function CodeEditor(props: EditorProps): ReactElement<EditorProps> {

    const [value, setValue] = useState<string>(props.value)

    useEffect(() => {
        props.onChange && props.onChange(value)
    }, [value])

    return (
        <>
            <AceEditor
                mode={"javascript"}
                value={value}
                debounceChangePeriod={600}
                setOptions={{
                    highlightActiveLine: true,
                    highlightSelectedWord: true,
                    showLineNumbers: true,
                    showPrintMargin: false,
                    hScrollBarAlwaysVisible: true,
                    vScrollBarAlwaysVisible: true,
                    showGutter: true
                }}
                width={"auto"}
                onChange={setValue}
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