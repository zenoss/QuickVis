"use strict";

import QuickVis from "quickviscore";
import Sparkline from "Sparkline";
import {linearScale, createSVGNode, getFormattedNumber} from "utils";

function template(vm){
    return `
        <table class="sparklines"></table>
    `;
}

export default class SparklineGrid extends QuickVis {

    constructor(config){
        super(config);
        this.template = template;

        this.el.classList.add("sparkline-grid");
        this.sparklines = config.sparklines.map(c => {
            // TODO - reevaluate config object
            c.config.size = "row";
            let sparky = new Sparkline(c.config);
            return {
                config: c.config,
                vals: c.vals,
                sparkline: sparky
            };
        });
    }

    _render(){
        super._render();
        let sparklinesEl = this.el.querySelector(".sparklines");
        // TODO - detach sparklinesEl first?
        this.sparklines.forEach(s => {
            sparklinesEl.appendChild(s.sparkline.el);
            s.sparkline.render(s.vals);
        });
    }
}
