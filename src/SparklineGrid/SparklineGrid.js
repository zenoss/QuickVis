"use strict";

import QuickVis from "quickviscore";
import Sparkline from "Sparkline";
import {linearScale, createSVGNode, getFormattedNumber} from "utils";

function template(vm){
    return `
        <div class="sparklines"></div>
    `;
}

// row based template for sparkline
function rowTemplate(vm){
    return `
        <div class="metric">${vm.metric}</div>
        <div class="graph-row"><svg class="graph"></svg></div>
        <div class="last">
            <!-- NOTE: the html comment after this span is to prevent
                extra whitespace being added between the 2 elements -->
            <span class="last-val">${vm.getFriendly(vm.last)}</span><!--
            --><span class="units">${vm.getMagnitude(vm.last) + vm.unit}</span>
        </div>
        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}


export default class SparklineGrid extends QuickVis {

    constructor(config){
        super(config);
        this.template = template;

        this.el.classList.add("sparkline-grid");
        this.sparklines = config.sparklines.map(c => {
            c.template = rowTemplate;
            let sparky = new Sparkline(c);
            return {
                config: c,
                sparkline: sparky
            };
        });
    }

    focus(val){
        this.sparklines.forEach(s => s.sparkline.focus(val));
    }

    blur(){
        this.sparklines.forEach(s => s.sparkline.blur());
    }

    _render(){
        super._render();
        let sparklinesEl = this.el.querySelector(".sparklines");
        // TODO - detach sparklinesEl first?
        this.sparklines.forEach((s, i) => {
            sparklinesEl.appendChild(s.sparkline.el);
            s.sparkline.render(this.data[i]);
        });
    }
}
