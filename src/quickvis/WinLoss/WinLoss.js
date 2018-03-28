/*global console: true */
"use strict";

import QuickVis from "../quickviscore";
import {getFormattedNumber, downsampleData} from "../utils";

function winLossTemplate(vm){
    return `
        <div class="label"><div class="label-text">${vm.label}</div></div>
        <div class="visualization">
            <div class="topsies">
                ${vm.data
                    .map(dp => vm.winLoseOrDraw(dp))
                    .map(wld => wld === 1 ? true : false)
                    .map(marked => `<div class="winloss-block ${marked ? "marked" : ""}"></div>`)
                    .join("")}
            </div>
            <div class="bottomsies">
                ${vm.data
                    .map(dp => vm.winLoseOrDraw(dp))
                    .map(wld => wld === -1 ? true : false)
                    .map(marked => `<div class="winloss-block ${marked ? "marked" : ""}"></div>`)
                    .join("")}
            </div>
        </div>
        <div class="last-value" ${vm.hideWinPercent ? 'style="display:none;"' : ""}>
            <div class="value">${vm.getWinPercent()}</div>
            <div class="unit">%</div>
            <div class="magnitude"></div>
        </div>
        <div class="indicator ${vm.lastIsBad() ? "on" : ""}"></div>
    `;
}

const defaultConfig = {
    template: winLossTemplate,
    label: "",
    hideWinPercent: false,
    tickCount: 0,
    downsampleFn: downsampleData.MAX
};

export default class WinLoss extends QuickVis {
    constructor(data, config){
        super(data, "div", winLossTemplate, "win-loss", config);
    }

    _update(data, config){
        if(!data || !data.length){
            throw new Error("cannot create graph bar from empty data");
        }

        config = Object.assign({}, defaultConfig, config);
        this.config = config;
        this.label = config.label;
        this.hideWinPercent = config.hideWinPercent;
        this.tickCount = config.tickCount || data.length;
        this.downsampleFn = config.downsampleFn;

        this.data = downsampleData(data, this.tickCount, this.downsampleFn);
        let [total, win] = this.data.reduce((acc, dp) => {
            let wld = this.winLoseOrDraw(dp);
            // if its a draw, dont increment nothin'
            if(wld === 0){
                return acc;
            }

            // increment total
            acc[0] += 1;

            // increment wins
            if(wld === 1){
                acc[1]++;
            }
            // increment losses
            if(wld === -1){
                acc[2]++;
            }
            return acc;
        }, [0,0,0]);

        this.winPercent = win / total * 100;
    }

    getFormattedNumber(val){
        return getFormattedNumber(val).join("");
    }

    getLast(){
        if(this.data){
            return this.data.slice(-1)[0];
        }
        return null;
    }

    lastIsBad(){
        let last = this.getLast();
        if(last || last === null){
            return false;
        } else {
            return true;
        }
    }

    winLoseOrDraw(val){
        if(val === undefined || val === null){
            return 0;
        } else if(val){
            return 1;
        } else {
            return -1;
        }
    }

    getWinPercent(){
        return Math.floor(this.winPercent);
    }

    focus(val){
        if(this.data && this.rendered){
            let start = val;
            let end;
            // oooh a range
            if(Array.isArray(val)){
                start = val[0];
                end = val[1];
                // use last value for displaying stuff
                val = end;
            }

            let pos = Math.floor(this.data.length * val);
            // TODO HACK FIX - i dunno, ya know?
            pos = pos === this.data.length ? pos - 1 : pos;
            this.blur();
            this.el.classList.add("focused");

            // this.el.querySelector(`.topsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
            // this.el.querySelector(`.bottomsies .winloss-block:nth-child(${pos+1})`).classList.add("focused");
            let topEls = Array.from(this.el.querySelectorAll(`.topsies .winloss-block`));
            let bottomEls = Array.from(this.el.querySelectorAll(`.bottomsies .winloss-block`));
            if(!topEls || !bottomEls){
                // things arent rendered, or no data or *something*
                return;
            }
            let focusEls = [topEls[pos], bottomEls[pos]];

            // if this should affect a range
            if(end){
                let startPos = Math.floor(this.data.length * start);
                // TODO HACK FIX - i dunno, ya know?
                startPos = startPos === this.data.length ? startPos - 1 : startPos;
                focusEls = [ ...topEls.slice(startPos, pos), ...bottomEls.slice(startPos, pos) ];
            }

            focusEls.forEach(el => el.classList.add("focused"));

            let indicatorEl = this.el.querySelector(".indicator");
            // LOOK im just trying to get this demo out. this code can all
            // burn in hell after this
            let last = this.data[Math.floor(this.data.length * val)];
            let status = "";
            // HACK - this is copy pasta
            if(!last && last !== null){
                status = "on";
            }
            indicatorEl.setAttribute("class", `indicator ${status}`);
        }
    }

    blur(){
        let nodes = this.el.querySelectorAll(`.winloss-block.focused`);
        let els = Array.from(nodes);
        els.forEach(el => el.classList.remove("focused"));
        this.el.classList.remove("focused");

        let indicatorEl = this.el.querySelector(".indicator");
        if(indicatorEl){
            let status = this.lastIsBad() ? "on" : "";
            indicatorEl.setAttribute("class", `indicator ${status}`);
        }
    }
}
