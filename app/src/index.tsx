import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './Router';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.min.css';


ReactGA.initialize('UA-42276885-4', {
  gaOptions: {
    userId: localStorage.getItem('my-user-id') || undefined
  }
});

Sentry.init({
    dsn: "https://5545a9f3e22f4324aa1ebb961da44441@o441612.ingest.sentry.io/5412026",
    integrations: [
      new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
  });
  

ReactDOM.render(<Router />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
