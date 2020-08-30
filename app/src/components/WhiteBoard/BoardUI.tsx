import React, { ReactElement, Component } from 'react'

const MSG = {
    Hello: 0,
    Text: 1,
    ChangeUser: 2,
    PresentUsers: 3,
    EmptyCanvas: 4,
}

const DEFAULT_USER = 'user';
const DEFAULT_COLOR = '#333333';

const PALM_REJECTION_LIMIT = 200 * 200;
const CURVE_SMOOTHING_LIMIT = 10;
const TOAST_DELAY = 1600;

class UserEditDialog  {
    private handleSave : any;
    private handleColorInput : any;
    private handleNameInput : any;
    private name : any;
    private color : any;
    private labels: any = {};

    
    constructor(name: any, color: any, saveCallback: any) {
        
        this.name = name;
        this.color = color;

        this.handleSave = () => saveCallback(this.name, this.color);
        this.handleNameInput = this.handleInput.bind(this, 'name');
        this.handleColorInput = this.handleInput.bind(this, 'color');
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    handleInput(label: any, evt: any) {
        const value = evt.target.value;
        this.labels[label] = value;
        // this.render();
    }

    handleKeydown(evt: any) {
        if (evt && evt.key === 'Enter') {
            this.handleSave();
        }
    }

    render() {
        return (<div className="userEditDialog-wrapper">
            <div className="userEditDialog">
                <div className="userEditDialog-form fixed block">
                    <div className="inputGroup">
                        <label /* for="ued--name" */>Name</label>
                        <div className="inputWrapper fixed block">
                            <input type="text" placeholder="User" id="ued--name"
                                // autofocus
                                value={this.name}
                                onChange={this.handleNameInput}
                                onKeyDown={this.handleKeydown}/>
                        </div>
                    </div>

                    <div className="inputGroup">
                        <label /* for="ued--color" */>Color</label>
                        <div className="inputWrapper fixed block">
                            <input type="color" id="ued--color"
                                value={this.color}
                                onChange={this.handleColorInput}
                                onKeyDown={this.handleKeydown}/>
                        </div>
                    </div>

                    <button onClick={this.handleSave} className="updateButton accent block">Update</button>
                </div>
            </div>
        </div>);
    }

}

class App extends Component {
    private name: any;
    private color: any;
    private canvas: any;
    private editingUser: any;
    private dialog: any;
    private users: any;
    private toasts: any;
    private curves: any;
    private currentCurve: any;
    private isDragging: any;
    private xLast: any;
    private yLast: any;

    private conn: any

    private ctx : any;
    // private resize: any;
    // private onStart: any;
    // private onEnd: any;
    // private onMove: any;
    // private emptyCanvas: any;


    componentDidMount() {
        // super(props);

        this.name = DEFAULT_USER;
        this.color = DEFAULT_COLOR;
        // attempt to restore previous name, color
        // this.tryRestoreState();

        this.editingUser = this.name === DEFAULT_USER && this.color === DEFAULT_COLOR;
        this.dialog = new UserEditDialog(this.name, this.color, (name: any, color: any) => {
            this.changeUser(name, color);
            this.editingUser = false;
            this.render();
        });
        this.conn = null;

        // Used by presencer
        this.users = [];
        // user-visible alerts, FIFO queue
        this.toasts = [];
        // canvas states
        this.curves = [];
        this.currentCurve = [];
        // is the mouse being dragged (clicked down)?
        this.isDragging = false;
        // last positions used to calculated speed
        //  and thickness of stroke
        this.xLast = null;
        this.yLast = null;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.resize = this.resize.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
        this.emptyCanvas = this.emptyCanvas.bind(this);

        this.canvas.addEventListener('mousedown', this.onStart);
        this.canvas.addEventListener('touchstart', this.onStart);
        this.canvas.addEventListener('mouseup', this.onEnd);
        this.canvas.addEventListener('touchend', this.onEnd);
        this.canvas.addEventListener('mousemove', this.onMove);
        this.canvas.addEventListener('touchmove', this.onMove);

        window.addEventListener('resize', this.resize);

        // this.connect();
        this.resize();
    }

    remove() {
        window.removeEventListener('resize', this.resize);
    }

    saveState() {
        window.localStorage.setItem('state0', JSON.stringify({
            name: this.name,
            color: this.color,
        }));
    }

    tryRestoreState() {
        const stateString = window.localStorage.getItem('state0');
        if (stateString === null) {
            return;
        }

        try {
            const state = JSON.parse(stateString);
            this.name = state.name;
            this.color = state.color;
        } catch (e) {
            console.error(e);
        }
    }

    resize() {
        const dpr = window.devicePixelRatio || 2;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        this.render();
    }

    // connect() is responsible for establishing and keeping the lifecycle
    // of the websocket connection. It handles all incoming messages
    // and connects the websocket JSON stream to the rest of the app, dispatching
    // method calls as necessary.
   

    send(text: any) {
        // if (this.conn === null) {
        //     return;
        // }

        // this.conn.send(JSON.stringify({
        //     type: MSG.Text,
        //     text: text,
        // }));
    }

    toast(text: any) {
        // this.toasts.push(text);
        // this.render();

        // setTimeout(() => {
        //     this.toasts.shift();
        //     this.render();
        // }, TOAST_DELAY)
    }

    pushPt(x: any, y: any) {
        this.currentCurve.push([x, y]);
    }

    pushCurve() {
        const curve = {
            color: this.color,
            points: this.currentCurve,
        }
        this.currentCurve = [];
        this.curves.push(curve);

        this.send(JSON.stringify(curve));
    }

    onStart(evt: any) {
        evt.preventDefault();
        if (evt.touches) {
            // helps with palm rejection -- reject secondary touches
            if (evt.touches.length > 1) {
                return;
            }
            evt = evt.touches[0];
        }

        this.isDragging = true;
        this.xLast = evt.clientX;
        this.yLast = evt.clientY;

        this.pushPt(this.xLast, this.yLast);
    }

    onEnd(evt: any) {
        evt.preventDefault();
        this.isDragging = false;
        this.xLast = null;
        this.yLast = null;

        this.pushCurve();
    }

    onMove(evt: any) {
        evt.preventDefault();
        if (evt.touches) {
            evt = evt.touches[0];
        }
        if (!this.isDragging) {
            return;
        }

        const xPos = evt.clientX;
        const yPos = evt.clientY;

        const xDif = this.xLast - xPos;
        const yDif = this.yLast - yPos;
        const sqDist = xDif * xDif + yDif * yDif;
        if (sqDist > PALM_REJECTION_LIMIT) {
            // ignore jumps more than a limit -- palm rejection
            this.isDragging = false;
            this.xLast = null;
            this.yLast = null;
            this.pushCurve();
            return
        }
        if (sqDist <= CURVE_SMOOTHING_LIMIT) {
            return
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xLast, this.yLast);
        this.ctx.lineTo(xPos, yPos);
        this.ctx.stroke();

        this.xLast = xPos;
        this.yLast = yPos;

        this.pushPt(xPos, yPos);
    }

    emptyCanvas() {
        this.curves = [];
        this.currentCurve = [];
        this.render();

        // notify other clients
        if (this.conn === null) {
            return;
        }

        this.conn.send(JSON.stringify({
            type: MSG.EmptyCanvas,
        }));
    }

    drawCurve(curve: any) {
        const {color, points} = curve;
        let lastPt = points[0];
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        for (const pt of points.slice(1)) {
            this.ctx.beginPath();
            this.ctx.moveTo(lastPt[0], lastPt[1]);
            this.ctx.lineTo(pt[0], pt[1]);
            this.ctx.stroke();

            lastPt = pt;
        }
    }

    changeUser(name: any, color: any) {
        this.name = name;
        this.color = color;

        if (this.conn === null) {
            return;
        }

        this.saveState();
        // this.conn.send(JSON.stringify({
        //     type: MSG.ChangeUser,
        //     text: `${name}\n${color}`,
        // }));
    }

    render() {
        const User = (u: any) => (<div className="avatar fixed block">
            <div className="avatar-icon" style={{background:u.color}}></div>
            <div className="avatar-name">{u.name}</div>
        </div>);

        const Toast = (t: any) => (<li className="toast fixed block">{t}</li>);

        return (<div className="app">
            {this.canvas}
            <ul className="toasts">
                {this.toasts.map(Toast)}
            </ul>
            <nav className="nav">
                <div className="users">
                    {this.users.map(User)}
                </div>
                <div className="btnGroup">
                    <button className="avatarEditButton accent block" onClick={() => {
                        this.editingUser = !this.editingUser;
                        this.render();
                    }}>profile...</button>
                    <button className="emptyCanvasButton block" onClick={this.emptyCanvas}>
                        clear
                    </button>
                </div>
            </nav>
            {this.editingUser ? this.dialog.node : null}
        </div>);
    }

    rende2r() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const curve of this.curves) {
            this.drawCurve(curve);
        }
        this.drawCurve({
            color: this.color,
            points: this.currentCurve,
        });

        // super.render(...args);
    }

}