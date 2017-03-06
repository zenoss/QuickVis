"use strict";

import QuickVis from "quickviscore";
import StackedBar, {barTemplate} from "StackedBar";
import {linearScale, createSVGNode, getFormattedNumber} from "utils";

function template(vm){
    return `
        <div class="bars"></div>
    `;
}

// row based template for bar
function rowTemplate(vm){
    return `
        <div class="name">${vm.name}</div>
        <div class="bars-wrap">
            <div class="bars">
                ${vm.data.map(bar => barTemplate(vm, bar)).join("")}

                <!-- empty bar for free space -->
                ${ vm.free ?
                    barTemplate(vm, {name:"Free", val: vm.free}) :
                    ""}

                ${ vm.threshold !== Infinity ? 
                    `<div class="threshold" style="left: ${vm.getThresholdPosition()}%;"></div>` :
                    ""}

            </div>
        </div>
        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

export default class BarGrid extends QuickVis {

    constructor(config){
        super(config);
        this.template = template;
        this.el.classList.add("bar-grid");
        this.bars = config.bars.map(c => {
            c.template = rowTemplate;
            let bar = new StackedBar(c);
            return {
                config: c,
                bar: bar
            };
        });
    }

    focus(val){
        this.bars.forEach(s => s.bar.focus(val));
    }

    blur(){
        this.bars.forEach(s => s.bar.blur());
    }

    _render(){
        super._render();
        let barsEl = this.el.querySelector(".bars");
        // TODO - detach barsEl first?
        this.bars.forEach((s, i) => {
            barsEl.appendChild(s.bar.el);
            s.bar.render(this.data[i]);
        });
        // HACK - render twice because rendering each row may affect
        // the size of the table columns
        this.bars.forEach((s, i) => {
            s.bar.render(this.data[i]);
        });
    }
}
