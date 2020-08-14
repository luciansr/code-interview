import React, { ReactElement } from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

export default function MonacoCodeEditor(props: EditorProps): ReactElement<EditorProps> {

    // const handleEditorChange = (ev: any, value: string | undefined) => {
    //     props.onChange(value || ``);
    // };

    return (
        <>
            <MonacoEditor
                width="100%"
                height="100%"
                language="typescript"
                theme="vs-dark"
                value={props.value}
                options={{
                    codeLens: true
                }}
                onChange={props.onChange}
            />
        </>
    )
}