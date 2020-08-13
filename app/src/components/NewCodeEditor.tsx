import React, { ReactElement } from "react";
import ReactDOM from "react-dom";

import { ControlledEditor, ControlledEditorOnChange } from '@monaco-editor/react';

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

export default function NewCodeEditor(props: EditorProps): ReactElement<EditorProps> {
        
    const handleEditorChange = (ev: any, value: string | undefined) => {
        props.onChange(value || ``);
    };

    return (
        <>
            <ControlledEditor
                height="100vh"
                language="javascript"
                theme={"dark"}
                options={{

                }}
                value={props.value}
                onChange={handleEditorChange}
            />
        </>
    )
}