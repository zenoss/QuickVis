"use strict";

import QuickVis from "quickviscore";
import {createSVGNode, getFormattedNumber} from "utils";

function stackedBarTemplate(vm){
    return `
        <div class="hbox stacked-title">
            <div class="name">${vm.name}</div>
            <div class="capacity">${vm.getFormattedNumber(vm.capacity)}${vm.unit}</div>
        </div>
        <div class="bars">
            ${vm.data.map(bar => barTemplate(vm, bar)).join("")}
            <!-- empty bar for free space -->
            ${barTemplate(vm, {name:"free", val: vm.getFree()})}
            ${ vm.threshold ? 
                `<div class="threshold" style="left: ${vm.getRatio(vm.threshold) * 100}%;"></div>` :
                ""}
        </div>
        <div class="stacked-footer">
            <div class="free">Free: ${vm.getFormattedNumber(vm.getFree())}${vm.unit}</div> 
        </div>
    `;
}

function barTemplate(vm, bar){
    return `
        <div class="bar" style="flex: ${vm.getRatio(bar.val)} 0 0; background-color: ${vm.getColor(bar)};"
                title="${bar.name +": "+ vm.getFormattedNumber(bar.val) + vm.unit}">
            <div class="bar-label">
                <!-- this is a hack to cause labels that are
                    too long to not appear at all. text-overflow
                    ellipsis is not sufficient here -->
                &#8203; ${bar.name.replace(" ", "&nbsp;")}
            </div>
        </div>
    `;
}

// TODO - better palette
let colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

export default class StackedBar extends QuickVis {
    constructor(config){
        config.template = stackedBarTemplate;
        super(config);
        this.el.classList.add("stacked-bar");
        this.name = config.name;
        this.capacity = config.capacity;
        this.unit = config.unit || "B";
        this.threshold = config.threshold || 0;
    }

    _render(){
        super._render();
        this.barsEl = this.el.querySelector(".bars");
    }

    getTotal(){
        return this.data.reduce((acc, d) => acc + d.val, 0);
    }

    // returns fraction of capacity that val occupies
    getRatio(val){
        return val / this.capacity;
    }

    getColor(bar){
        // empty bar for free space
        if(bar.name === "free"){
            return "transparent";
        } else {
            // TODO - choose colors
            return colors[this.getIndexOf(bar)];
        }
    }

    getIndexOf(bar){
        return this.data.indexOf(bar);
    }

    getFree(){
        return this.capacity - this.getTotal();
    }

    getFormattedNumber(val){
        return getFormattedNumber(val).join("");
    }
}
