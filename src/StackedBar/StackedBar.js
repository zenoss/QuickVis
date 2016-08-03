"use strict";

import QuickVis from "quickviscore";
import {createSVGNode, getFormattedNumber} from "utils";

const COLOR_PALETTE_LENGTH = 10;

function stackedBarTemplate(vm){
    return `
        <div class="stacked-wrapper">
            <div class="hbox stacked-title">
                <div class="name">${vm.name}</div>
                <div class="capacity">${vm.getFormattedNumber(vm.capacity)}${vm.unit}</div>
            </div>
            <div class="bars">
                ${vm.data.map(bar => barTemplate(vm, bar)).join("")}

                <!-- empty bar for free space -->
                ${ vm.getFree() ?
                    barTemplate(vm, {name:"free", val: vm.getFree()}) :
                    ""}

                ${ vm.exceedsThreshold() ?
                    `<div class="overage-shading" style="left: ${vm.getThresholdPosition()}%; width: ${100 - vm.getThresholdPosition()}%"></div>` :
                    ""}

                ${ vm.threshold ? 
                    `<div class="threshold" style="left: ${vm.getThresholdPosition()}%;"></div>` :
                    ""}

            </div>
            <div class="stacked-footer">
                <div class="free">Free: ${vm.getFormattedNumber(vm.getFree())}${vm.unit}</div> 
            </div>
        </div>

        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

function barTemplate(vm, bar){
    return `
        <div class="bar ${vm.getColorClass(bar)}"
                style="flex: ${vm.getRatio(bar.val)} 0 0;"
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
        this.total = this.data.reduce((acc, d) => d.val + acc, 0);

        if(this.total > this.capacity){
            console.warn("StackedBar total (" + getFormattedNumber(this.total).join("") + ") " +
                "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " +
                "by " + getFormattedNumber(this.total-this.capacity).join(""));
        }
        super._render();
    }

    // returns fraction of total that val occupies
    getRatio(val){
        return Math.floor(val / this.total * 100);
    }

    getColorClass(bar){
        // empty bar for free space
        if(bar.name === "free"){
            return "bar-color-none";
        } else {
            // TODO - other color palettes?
            return "bar-color-" + (this.getIndexOf(bar) % COLOR_PALETTE_LENGTH);
        }
    }

    getIndexOf(bar){
        return this.data.indexOf(bar);
    }

    getFree(){
        let free = this.capacity - this.total;
        return free >= 0 ? free : 0;
    }

    getFormattedNumber(val){
        return getFormattedNumber(val).join("");
    }

    // if a threshold is set and the total exceeds
    // it, return true
    exceedsThreshold(){
        return this.threshold && this.total > this.threshold;
    }

    getIndicatorStatus(){
        return this.exceedsThreshold() ? "on" : "off";
    }

    // get percent position of threshold indicator
    getThresholdPosition(){
        return this.threshold / this.capacity * 100;
    }
}
