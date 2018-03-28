/*global console: true */
"use strict";

import QuickVis from "../quickviscore";
import {getFormattedNumber} from "../utils";

function template(vm){
    return `
        <div class="label"><div class="label-text">${vm.label}</div></div>
        <div class="visualization">
            <div class="bars">
                <div class="bar" style="flex: ${vm.getFocusedVal()} 0 0;" title="${vm.getTitle(name, vm.getFocusedVal())}"></div>
                <div class="bar bar-free" style="flex: ${vm.getFreeVal()} 0 0;" title="${vm.getFreeVal()} Free"></div>
                ${ vm.threshold !== Infinity ? 
                    `<div class="threshold" style="left: ${vm.getThresholdPosition()}%;"></div>` :
                    ""}
            </div>

        </div>
        <div class="last-value">
            <div class="value">${vm.getFocusedVal()}</div>
            <div class="magnitude">${vm.getFocusedMagnitude()}</div>
            <div class="unit">${vm.unit}</div>
        </div>

        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
}

const defaultConfig = {
    label: "",
    unit: "B",
    threshold: Infinity
};

export default class Bar extends QuickVis {
    constructor(data, config){
        super(data, "div", template, "simple-bar", config);
    }

    _update(data, config){
        if(!data){
            throw new Error("cannot create bar from empty data");
        }

        if(!Array.isArray(data)){
            data = [data];
        }
        this.data = data;
        this.focused = this.data.length - 1;

        config = Object.assign({}, defaultConfig, config);
        this.config = config;
        this.label = config.label;
        this.unit = config.unit;
        // TODO - make capacity required
        this.capacity = config.capacity;
        this.threshold = config.threshold;
        this.validateThreshold();
        this.free = this.capacity - this.getFocusedVal();

        this._render();
    }

    focus(val){
        let end;
        // oooh a range
        if(Array.isArray(val)){
            end = val[1];
            // use last value for displaying stuff
            val = end;
        }

        let pos = Math.floor(this.data.length * val);
        this.focused = pos;
        this._render();
    }

    blur(){
        this.focused = this.data.length - 1;
    }

    validateThreshold(){
        if(this.threshold === Infinity){
            // no threshold was set
            return;
        }
        if(this.threshold > this.capacity){
            console.warn("threshold exceeds capacity you silly person");
            this.threshold = Infinity;
        }
    }

    // if a threshold is set and the used exceeds
    // it, return true
    exceedsThreshold(){
        return !!(this.threshold && (this.getFocusedRaw() > this.threshold));
    }

    getFocusedRaw(){
        return this.data[this.focused];
    }
    getFocusedVal(){
        return getFormattedNumber(this.getFocusedRaw())[0];
    }
    getFocusedMagnitude(){
        return getFormattedNumber(this.getFocusedRaw())[1];
    }
    getFreeVal(){
        // TODO - ensure non-negative
        // TODO - format
        return this.capacity - this.getFocusedRaw();
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
            return "";
        }
    }

    // get percent position of threshold indicator
    // NOTE - assumes threshold and capacity
    getThresholdPosition(){
        return this.threshold / this.capacity * 100;
    }

    getTitle(name, val){
        let formatted = getFormattedNumber(this.getFocusedRaw()).join("") + this.unit;
        if(name){
            return name +": "+ formatted;
        } else {
            return formatted;
        }
    }
}
