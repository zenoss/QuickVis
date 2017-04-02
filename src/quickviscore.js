/* globals console: true */
"use strict";

// donify provides a way to export a promises resolve
// and reject callbacks. to reject the promise, call
// the callback with a non-null value for the first argument.
// To resolve the promise, call the callback with `null` for
// the first argument and optionally a resolve value for the
// second argument
function donify(resolve, reject){
    return function(err, data) {
        if(err !== null){
            reject(err);
        } else {
            resolve(data);
        }
    };
}

class DOMBatcher {
    constructor(frequency){
        this.frequency = frequency;
        this.inserts = [];
        this.insertTimer = null;

        this.bboxs = [];
        this.bboxTimer = null;
    }

    insert(el, str){
        let done;
        let p = new Promise((resolve, reject) => {
            done = donify(resolve, reject);
        });

        this.inserts.push([el, str, done]);
        if(!this.insertTimer){
            this.insertTimer = setTimeout(this._insertForReal.bind(this), this.frequency);
        }

        return p;
    }

    _insertForReal(){
        console.log(`performing ${this.inserts.length} inserts`);
        this.inserts.forEach(([el, str, done]) => {
            try {
                el.innerHTML = str;
                done(null);
            } catch(e){
                console.warn("couldnt insert html string", e);
                done("couldnt insert html string" + e);
            }
        });
        this.inserts = [];
        this.insertTimer = null;
    }

    getBBox(el){
        let done;
        let p = new Promise((resolve, reject) => {
            done = donify(resolve, reject);
        });

        this.bboxs.push([el, done]);
        if(!this.bboxTimer){
            this.bboxTimer = setTimeout(this._getBBoxForReal.bind(this), this.frequency);
        }

        return p;
    }

    _getBBoxForReal(){
        console.log(`getting ${this.bboxs.length} bboxes`);
        this.bboxs.forEach(([el, done]) => {
            try {
                let bb =el.getBoundingClientRect();
                done(null, bb);
            } catch(e){
                console.warn("couldnt get bbox", e);
                done("couldnt get bbox" + e);
            }
        });
        this.bboxs = [];
        this.bboxTimer = null;
    }

    // does its best to guess if dom batching
    // stuff is done doing things
    working(){
        let done;
        let p = new Promise((resolve, reject) => {
            done = donify(resolve, reject);
        });
        let count = 0,
            maxRetries = 10;
        let self = this;
        (function recur(){
            if(count >= maxRetries){
                console.warn("gave up waiting for quickvis to finis");
                done("gave up waiting for quickvis to finish");
            } else if(self.inserts.length + self.bboxs.length === 0){
                done(null);
            } else {
                count++;
                setTimeout(recur, 200);
            }
        })();
        return p;
    }
}
const INSERT_FREQUENCY = 100;
let dom = new DOMBatcher(INSERT_FREQUENCY);

export function working(){
    return dom.working();
}

// a quick n purty visualization
export default class QuickVis {
    // creates a dom element for the vis to live in
    // NOTE: don't manipulate the DOM from here
    constructor(config){
        config = config || {};
        this.el = document.createElement(config.tag || "div");
        this.template = config.template || function(vm){
            return `<strong>hi</strong>`;
        };
        this.rendered = false;

    }

    // stores the data then calls render
    // NOTE: el must be attached to the DOM to get
    // predictable results here!
    // NOTE: don't override this method. override _render
    render(data){
        if(!document.body.contains(this.el)){
            console.warn("Element is not attached to the DOM. This may produce unexpected issues with element layout");
        }
        this._update(data);
        // TODO - wait till after dom insert completes?
        this.rendered = true;
        return this._render();
    }

    // do some work with incoming data
    // NOTE: override this as needed
    // NOTE: don't manipulate the DOM from here
    _update(data){
        this.data = data;
    }

    // private implementation of render. applies
    // vm to template and replaces html inside of
    // vis's dom el
    // NOTE: override this guy at will!
    // NOTE: It's ok for _render to call out to 
    // other methods to touch the DOM, but once 
    // _render's done, DOM time is OVER!
    // NOTE: don't touch the DOM outside of this.el
    _render(){
        let htmlStr = this.template(this);
        // NOTE - make sure any event listeners
        // or references to DOM elements have
        // been cleared or this will leak!
        //this.el.innerHTML = htmlStr;
        return dom.insert(this.el, htmlStr);
    }

    getBBox(el){
        return dom.getBBox(el);
    }
}
