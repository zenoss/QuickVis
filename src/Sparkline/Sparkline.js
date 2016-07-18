"use strict";

import QuickVis from "quickviscore";
import {linearScale, createSVGNode, getFormattedNumber} from "utils";

// template functions should take a viewmodel and return a string
// that can be put into the DOM. there should be as little logic in
// here as possible. Prefer to create viewmodel methods to handle
// logic.
function fullTemplate(vm){
    return `
        <div class="metric">${vm.metric}</div>
        <div class="hbox spark-content">
            <svg class="graph"></svg>
            <div class="last">${vm.getFriendly(vm.last)}</div>
            <div class="vbox spark-value">
                <div class="units">${vm.getMagnitude(vm.last) + vm.unit}</div>
                <div class="hbox spark-trend">
                    <div class="trend">${vm.getDeltaDirectionArrow()}</div>
                    <div class="delta">${vm.getFriendlyDelta()}</div>
                </div>
            </div>
            <div class="indicator ${vm.getIndicatorStatus()}"></div>
        </div>
    `;
}

function compactTemplate(vm){
    return `
        <div class="metric">${vm.metric}</div>
        <div class="hbox spark-content">
            <svg class="graph"></svg>
            <div class="last">
                <span class="last-val">${vm.getFriendly(vm.last)}</span>
                <span class="unit">${vm.getMagnitude(vm.last) + vm.unit}</span>
            </div>
            <div class="indicator ${vm.getIndicatorStatus()}"></div>
        </div>
    `;
}

function rowTemplate(vm){
    return `
        <div class="hbox spark-content">
            <div class="metric">${vm.metric}</div>
            <svg class="graph"></svg>
            <div class="last-val">${vm.getFriendly(vm.last)}</div>
            <div class="unit">${vm.getMagnitude(vm.last) + vm.unit}</div>
            <div class="indicator ${vm.getIndicatorStatus()}"></div>
        </div>
    `;
}

let templates = {
    full: fullTemplate,
    compact: compactTemplate,
    row: rowTemplate
};

const SPARKLINE_PADDING = 4;
const SPARKLINE_DATA_PADDING = 1;

const defaultConfig = {
    metric: "",
    style: "line",
    threshold: Infinity,
    size: "full",
    template: fullTemplate,
    unit: "B"
};

export default class Sparkline extends QuickVis {
    // setup configuration related thingies
    constructor(config){
        config = Object.assign({}, defaultConfig, config);

        config.template = templates[config.size];
        if(!config.template){
            throw new Error(`Invalid sparkline size '${config.size}'`);
        }

        super(config);
        this.el.classList.add("sparkline");
        this.el.classList.add(config.size);
        this.metric = config.metric;
        this.threshold = config.threshold;
        this.forceThreshold = config.forceThreshold;
        this.style = config.style;
        this.unit = config.unit;
    }

    // update the model data and generate new data as
    // needed from the model data. Do not modify the model,
    // and if new data is needed, be sure its actual data
    // and not just view-related stuff (like text formatting)
    _update(data){
        if(!data || !data.length){
            throw new Error("cannot create sparkline from empty data");
        }

        this.data = data;
        this.last = data[data.length - 1];
        // TODO - dont use 0 to start average calc
        this.avg = this.data.reduce((acc, val) => acc + val, 0) / this.data.length;
        this.delta = this.last - this.avg;
    }

    /*******************
     * rendering and drawing functions are the only place
     * that it is ok to touch the dom!
     */
    _render(){
        super._render();
        this.svg = this.el.querySelector(".graph");
        let bb = this.svg.getBoundingClientRect();
        this.setScales(bb.width, bb.height);
        this.setDrawableArea(bb.width, bb.height);

        switch(this.style){
            case "area":
                this.fillSparkline()
                    .drawSparkline()
                    .drawThreshold();
                break;
            case "line":
                this.drawSparkline()
                    .drawThreshold();
                break;
            case "bar":
                this.drawBars()
                    .drawThreshold();
                break;
            case "scatter":
                this.drawScatter()
                    .drawThreshold();
                break;
        }
    }

    // sets up x and y scales, with consideration to including
    // padding in the drawable area
    setScales(width, height){
        let dataRange = this.data;

        // if forceThreshold, add it to the dataRange
        // so that min/max will include it
        if(this.forceThreshold){
            dataRange = dataRange.concat(this.threshold);
        }

        let min = Math.min.apply(Math, dataRange),
            max = Math.max.apply(Math, dataRange);

        this.xDomain = [0, this.data.length-1];
        // NOTE - min and max are swappped since the 
        // 0,0 origin is upper left (aka going down on
        // y axis is actually incrementing the y value)
        this.yDomain = [max + SPARKLINE_DATA_PADDING, min - SPARKLINE_DATA_PADDING];
        this.xScale = linearScale(this.xDomain, [SPARKLINE_PADDING, width-SPARKLINE_PADDING]);
        this.yScale = linearScale(this.yDomain, [SPARKLINE_PADDING, height-SPARKLINE_PADDING]);
    }

    // creates the bounds of the drawable area of the svg
    // to prevent elements from being clipped off the edges
    setDrawableArea(width, height){
        if(!this.xScale || !this.yScale){
            throw new Error("Cannot setup drawable area; scales have not been setup");
        }

        this.drawableArea = {
            x1: this.xScale(this.xDomain[0]),
            y1: this.yScale(this.yDomain[0]),
            x2: this.xScale(this.xDomain[1]),
            y2: this.yScale(this.yDomain[1])
        };
        this.drawableArea.width = this.drawableArea.x2 - this.drawableArea.x1;
        this.drawableArea.height = this.drawableArea.y2 - this.drawableArea.y1;

    }

    fillSparkline(){
        this.drawSparkline(true);
        return this;
    }

    drawSparkline(shaded=false){
        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea,
            d = [];

        if(shaded){
            d.push(`M${x1},${y2}`);
            d.push(`L${x1},${y1}`);
        } else {
            //d.push(`M${x1},${y2}`);
            d.push(`M${x1},${yScale(this.data[0])}`);
        }
        this.data.forEach((dp, i) => {
            d.push(`L${xScale(i)},${yScale(dp)}`);
        });
        if(shaded){
            d.push(`L${x2},${y2}`);
        }

        svg.appendChild(createSVGNode("path", {
            d: d.join(" "),
            stroke: shaded ? "transparent" : "#555",
            strokeWidth: 1,
            // TODO - configurable fill
            fill: shaded ? "#CCC" : "transparent"
        }));
        return this;
    }

    drawBars(){
        const BAR_PADDING = 1;
        let {svg, xScale, yScale} = this,
            {x2, y2, width} = this.drawableArea,
            barWidth = (width / (this.data.length)) - BAR_PADDING;

        this.data.forEach((dp, i) => {
            let barDiff = this.yScale(dp),
                barHeight = Math.ceil(y2 - barDiff) || 1;
            svg.appendChild(createSVGNode("rect", {
                x: this.xScale(i) - i,
                y: y2 - barHeight,
                width: barWidth,
                height: barHeight,
                stroke: "transparent",
                fill: dp > this.threshold ? "red" : "#AAA"
            }));
        });
        return this;
    }

    drawScatter(){
        let {svg, xScale, yScale} = this,
            {x2, y2, width} = this.drawableArea;

        this.data.forEach((dp, i) => {
            svg.appendChild(createSVGNode("circle", {
                cx: this.xScale(i),
                cy: this.yScale(dp),
                r: 4,
                fill: dp > this.threshold ? "red" : "#AAA"
            }));
        });
        return this;
    }

    drawThreshold(){
        if(this.threshold === Infinity){
            return this;
        }

        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea;
        svg.appendChild(createSVGNode("line", {
            x1: x1,
            y1: yScale(this.threshold),
            x2: x2,
            y2: yScale(this.threshold),
            stroke: "#AAA",
            strokeWidth: 2,
            strokeDasharray: "2,2",
            fill: "transparent"
        }));
        return this;
    }

    drawLastPoint(){
        let {svg, xScale, yScale} = this,
            x = this.data.length - 1,
            y = this.data[this.data.length-1];
        svg.appendChild(createSVGNode("circle", {
            cx: xScale(x),
            cy: yScale(y),
            r: 3,
            fill: this.lastExceedsThreshold() ? "red" : "#555"
        }));
        return this;
    }

    /*************
     * vm methods transform model data into something
     * the view can use to make data useful to the user
     */
    getFriendly(val){
        return getFormattedNumber(val)[0];
    }

    getMagnitude(val){
        return getFormattedNumber(val)[1];
    }

    getFriendlyDelta(){
        let [val, magnitude] = getFormattedNumber(this.delta);
        return Math.abs(val) + magnitude + this.unit;
    }

    getDeltaDirectionArrow(){
        let [val] = getFormattedNumber(this.delta);
        return val > 0 ? "▴" : val === 0 ? "" : "▾";
    }

    getDeltaDirectionClass(){
        let [val] = getFormattedNumber(this.delta);
        return val > 0 ? "up" : val === 0 ? "" : "down";
    }

    lastExceedsThreshold(){
        return this.last > this.threshold;
    }

    getIndicatorStatus(){
        return this.lastExceedsThreshold() ? "on" : "off";
    }
}

