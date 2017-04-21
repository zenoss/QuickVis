/* globals console: true */
"use strict";

import ResizeObserver from "resize-observer-polyfill";
import fastdom from "fastdom";

/* QuickVis makes a quick and perty visualization.
 * The constructor sets up the DOM element, resize listener, then
 * passes data and config to _update. _update uses config to 
 * configure things and reformates data as needed, and finally
 * calls _render. _render applies the data to the template and
 * inserts it in the DOM.
 *
 * Override _update and _render as needed.
 */

// a quick n purty visualization
export default class QuickVis {
    // creates a dom element for the vis to live in
    // optionally pass in data to render
    // NOTE: don't manipulate the DOM from here
    constructor(data, tag, template, className, config){
        // wrapper el
        this.el = document.createElement(tag || "div");
        this.el.classList.add("quickvis");
        if(className){
            this.el.classList.add(className);
        }
        // resize listener
        this._resizeObserve();
        // content template
        this.template = template || function(vm){
            return `<strong>hi</strong>`;
        };
        this.rendered = false;
        // do something!
        this._update(data, config);
    }

    _resizeObserve(){
        this.contentRect = {};
        this.observer = new ResizeObserver((entries, observer) => {
            for(let entry of entries){
                if(entry.target === this.el){
                    let oldW = this.contentRect.width;
                    let oldH = this.contentRect.height;
                    let newW = entry.contentRect.width;
                    let newH = entry.contentRect.height;
                    // check if width or height have changed
                    if(oldW !== newW || oldH !== newH){
                        this._onResize(entry.contentRect);
                    }
                    this.contentRect = entry.contentRect;
                }
            }
        });
        this.observer.observe(this.el);
    }

    _onResize(newSize){
        // console.log(`resize: old w: ${this.contentRect.width}, h: ${this.contentRect.height}; new w: ${newSize.width}, h: ${newSize.height}`);
        // TODO - debounce render probably
        this._render();
    }

    // do some work with incoming data
    // NOTE: override this as needed
    // NOTE: don't manipulate the DOM from here
    _update(data, config){
        this.data = data;
        this.config = config;
        // TODO - conditionally render?
        this._render();
    }

    // NOTE: override this as needed
    // NOTE: do all your DOM work here, but nowhere
    // else!
    _render(){
        this.rendered = false;
        let htmlStr = this.template(this);
        // TODO - provide a cleanup function before
        // re-render blows away the old dom els
        return this.insert(htmlStr).then(() => {
            this.rendered = true;
        });
    }

    // DOM helpers to prevent thrashing
    insert(htmlStr){
        return new Promise((resolve, reject) => {
            fastdom.mutate(() => {
                this.el.innerHTML = htmlStr;
                resolve();
            });
        });
    }
    measure(el){
        return new Promise((resolve, reject) => {
            fastdom.measure(() => {
                let bb = el.getBoundingClientRect();
                resolve(bb);
            });
        });
    }
}
