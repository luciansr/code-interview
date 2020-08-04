import React, { ReactElement } from 'react';

import ButtonsShowcase from './Buttons';
import ToastsShowcase from './Toasts';

export default function ReactBootstrapExample(): ReactElement {
    return (<>
        <h1 className="f1">
            Welcome To React-Bootstrap TypeScript Example
          </h1>
        <h2>Buttons</h2>
        <ButtonsShowcase />
        <h2>Toasts</h2>
        <ToastsShowcase />
    </>);
}