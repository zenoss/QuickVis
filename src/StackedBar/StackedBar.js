/*global console: true */
"use strict";

import QuickVis from "quickviscore";
import {createSVGNode, getFormattedNumber} from "utils";

const COLOR_PALETTE_LENGTH = 10;

function stackedBarTemplate(vm){
    return `
        <div class="stacked-wrapper">
            <div class="name">${vm.name}</div>
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
            <div class="stacked-footer">
                ${ vm.originalCapacity ? `
                    <div class="used">Used: <strong>${vm.getFormattedNumber(vm.used)}${vm.unit}</strong></div>
                    <div class="free">Free: <strong>${vm.getFormattedNumber(vm.free)}${vm.unit}</strong></div>` :
                    ""
                }
                <div class="total">Total: <strong>${vm.getFormattedNumber(vm.capacity)}${vm.unit}</strong></div>
            </div>
        </div>

        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

export function barTemplate(vm, bar){
    let {name, val} = bar;
    if(!name){
        name = "";
    }

    return `
        <div class="bar ${vm.getColorClass(bar)} ${ name === "Free" ? "free" : ""}"
                style="flex: ${val} 0 0;"
                title="${vm.getTitle(name, val)}">
            <div class="bar-label">
                <!-- this is a hack to cause labels that are
                    too long to not appear at all. text-overflow
                    ellipsis is not sufficient here -->
                &#8203; ${name.replace(" ", "&nbsp;")}
            </div>
        </div>
    `;
}

const defaultConfig = {
    template: stackedBarTemplate,
    name: "",
    unit: "B",
    threshold: Infinity
};

export default class StackedBar extends QuickVis {
    constructor(config){
        config = Object.assign({}, defaultConfig, config);
        super(config);
        this.el.classList.add("stacked-bar");
        this.name = config.name;
        this.unit = config.unit;
        this.originalCapacity = config.capacity;
        this.originalThreshold = config.threshold;
    }

    _update(data){
        if(!data){
            throw new Error("cannot create stacked bar from empty data");
        }

        this.data = data;
        this.used = this.data.reduce((acc, d) => d.val + acc, 0);

        // set capacity and threshold to
        // original user requested values
        this.capacity = this.originalCapacity;
        this.threshold = this.originalThreshold;

        this.validateCapacity();
        this.validateThreshold();

        let free = this.capacity - this.used;
        this.free = free >= 0 ? free : 0;
    }

    validateCapacity(){
        // if no capacity was set, set it
        if(!this.capacity){
            this.capacity = this.used;
        }

        // if the total used value exceeds capacity, set
        // the capacity to the total used value.
        // aka: raise the roof
        if(this.used > this.capacity){
            console.warn("StackedBar used (" + getFormattedNumber(this.used).join("") + ") " +
                "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " +
                "by " + getFormattedNumber(this.used-this.capacity).join(""));
            this.capacity = this.used;
        }
    }

    validateThreshold(){
        if(this.threshold === Infinity){
            // no threshold was set
            return;
        }
        if(this.threshold > this.capacity){
            console.warn("StackedBar threshold (" + getFormattedNumber(this.threshold).join("") + ") " +
                "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " +
                "so it is being ignored");
            this.threshold = Infinity;
            return;
        }
    }

    getColorClass(bar){
        // empty bar for free space
        if(bar.name === "Free"){
            return "bar-color-none";
        } else {
            // TODO - other color palettes?
            return "bar-color-" + (this.getIndexOf(bar) % COLOR_PALETTE_LENGTH);
        }
    }

    getIndexOf(bar){
        return this.data.indexOf(bar);
    }

    getFormattedNumber(val){
        if(val === null){
            return "";
        }
        return getFormattedNumber(val).join("");
    }

    // if a threshold is set and the used exceeds
    // it, return true
    exceedsThreshold(){
        return !!(this.threshold && (this.used > this.threshold));
    }

    getIndicatorStatus(){
        if(this.threshold === Infinity){
            // if no threshold is set
            return "off";
        } else if(this.exceedsThreshold()){
            // if threshold is breached
            return "on";
        } else {
            // if threshold is safe
            return "safe";
        }
    }

    // get percent position of threshold indicator
    // NOTE - assumes threshold and capacity
    getThresholdPosition(){
        return this.threshold / this.capacity * 100;
    }

    getTitle(name, val){
        let formatted = this.getFormattedNumber(val) + this.unit;
        if(name){
            return name +": "+ formatted;
        } else {
            return formatted;
        }
    }
}
