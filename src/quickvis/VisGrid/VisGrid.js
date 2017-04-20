"use strict";

import fastdom from "fastdom";

export default class VisGrid {
    constructor(config){
        this.el = document.createElement("div");
        this.el.classList.add("quickvis");
        this.el.classList.add("vis-grid");

        this.vis = config.vis;
        // attach each vis to this grid
        fastdom.mutate(() => {
            this.vis.forEach(v => {
                this.el.appendChild(v.el);
                v._render();
            });

            fastdom.measure(() => {
                /*
                let max = [0,0,0,0];
                const selectors = [".label", ".visualization", ".last-value", ".indicator"];
                this.vis.forEach(v => {
                    selectors.forEach((selector, i) => {
                        let w = v.el.querySelector(selector).getBoundingClientRect().width;
                        max[i] = Math.max(w, max[i]);
                    });
                });
                console.log(max);
                */

                let w = this.el.getBoundingClientRect().width;
            });
        });
    }

    focus(val){
        this.vis.forEach(v => {
            v.focus(val);
        });
    }
    blur(){
        this.vis.forEach(v => {
            v.blur();
        });
    }

}
