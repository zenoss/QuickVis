"use strict";

import QuickVis from "quickviscore";
import {toEng, linearScale, createNode, shortenNumber} from "utils";

// template functions should take a viewmodel and return a string
// that can be put into the DOM. there should be as little logic in
// here as possible. Prefer to create viewmodel methods to handle
// logic.
function sparklineTemplate(vm){
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

const SPARKLINE_PADDING = 4;
const SPARKLINE_DATA_PADDING = 1;

export default class Sparkline extends QuickVis {
    // setup configuration related thingies
    constructor(config){
        config.template = sparklineTemplate;
        super(config);
        this.el.classList.add("sparkline");
        this.metric = config.metric;
        this.threshold = config.threshold;
        this.unit = config.unit;
        this.style = config.style || "line";
    }

    // update the model data and generate new data as
    // needed from the model data. Do not modify the model,
    // and if new data is needed, be sure its actual data
    // and not just view-related stuff (like text formatting)
    _update(data){
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
        let {width, height} = this.svg.getBoundingClientRect(),
            xRange = [0, this.data.length-1],
            yRange = [Math.max.apply(Math, this.data) + SPARKLINE_DATA_PADDING,
                Math.min.apply(Math, this.data) - SPARKLINE_DATA_PADDING];
        this.xScale = linearScale(xRange, [SPARKLINE_PADDING, width-SPARKLINE_PADDING]);
        this.yScale = linearScale(yRange, [SPARKLINE_PADDING, height-SPARKLINE_PADDING]);
        this.drawableArea = {
            x1: this.xScale(xRange[0]),
            y1: this.yScale(yRange[0]),
            x2: this.xScale(xRange[1]),
            y2: this.yScale(yRange[1])
        };
        this.drawableArea.width = this.drawableArea.x2 - this.drawableArea.x1;
        this.drawableArea.height = this.drawableArea.y2 - this.drawableArea.y1;

        switch(this.style){
            case "line":
                this.fillSparkline()
                    .drawSparkline()
                    .drawThreshold()
                    .drawLastPoint();
                break;
            case "area":
                this.drawSparkline()
                    .drawThreshold()
                    .drawLastPoint();
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

        svg.appendChild(createNode("path", {
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
            svg.appendChild(createNode("rect", {
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
            svg.appendChild(createNode("circle", {
                cx: this.xScale(i),
                cy: this.yScale(dp),
                r: 4,
                fill: dp > this.threshold ? "red" : "#AAA"
            }));
        });
        return this;
    }

    drawLastPoint(){
        let {svg, xScale, yScale} = this,
            x = this.data.length - 1,
            y = this.data[this.data.length-1];
        svg.appendChild(createNode("circle", {
            cx: xScale(x),
            cy: yScale(y),
            r: 3,
            fill: this.lastExceedsThreshold() ? "red" : "#555"
        }));
        return this;
    }

    drawThreshold(){
        if(this.threshold === undefined){
            return this;
        }

        let {svg, xScale, yScale} = this,
            {x1, y1, x2, y2} = this.drawableArea;
        svg.appendChild(createNode("line", {
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

    /*************
     * vm methods transform model data into something
     * the view can use to make data useful to the user
     */
    getFriendly(val){
        if(Math.abs(val) < 1){
            return shortenNumber(val);
        }
        return toEng(val)[0];
    }

    getMagnitude(val){
        if(Math.abs(val) < 1){
            return "";
        }
        return toEng(val)[1];
    }

    getFriendlyDelta(){
        let delta = this.delta;
        if(Math.abs(delta) < 1){
            return Math.abs(shortenNumber(delta)) + this.unit;
        }
        let [val,magnitude] = toEng(delta);

        return Math.abs(val) + magnitude + this.unit;
    }

    getDeltaDirectionArrow(){
        let delta = this.delta;
        if(Math.abs(delta) < 1){
            delta = shortenNumber(delta);
        }
        return delta > 0 ? "▴" : delta === 0 ? "" : "▾";
    }

    getDeltaDirectionClass(){
        let delta = this.delta;
        if(Math.abs(delta) < 1){
            delta = shortenNumber(delta);
        }
        return delta > 0 ? "up" : delta === 0 ? "" : "down";
    }

    lastExceedsThreshold(){
        return this.last > this.threshold;
    }

    getIndicatorStatus(){
        return this.lastExceedsThreshold() ? "on" : "off";
    }
}
