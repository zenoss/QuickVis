/* globals console: true */
"use strict";

// a quick n purty visualization
export default class QuickVis {
    // creates a dom element for the vis to live in
    constructor(config){
        config = config || {};
        this.el = document.createElement(config.tag || "div");
        this.template = config.template || function(vm){
            return `<strong>hi</strong>`;
        };

    }

    // stores the data then calls render
    // NOTE: el must be attached to the DOM to get
    // predictable results here!
    render(data){
        if(!document.body.contains(this.el)){
            console.warn("Element is not attached to the DOM. This may produce unexpected issues with element layout");
        }
        this._update(data);
        this._render();
    }

    // do some work with incoming data
    _update(data){
        this.data = data;
    }

    // private implementation of render. applies
    // vm to template and replaces html inside of
    // vis's dom el
    _render(){
        let htmlStr = this.template(this);
        // NOTE - make sure any event listeners
        // or references to DOM elements have
        // been cleared or this will leak!
        this.el.innerHTML = htmlStr;
    }
}
