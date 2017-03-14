/*global console: true */
"use strict";

import QuickVis from "quickviscore";
import {createSVGNode, getFormattedNumber} from "utils";

const COLOR_PALETTE_LENGTH = 10;

function winLossTemplate(vm){
    return `
        <div class="name">${vm.name}</div>
        <div class="winlosses">
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
        <div class="win-percent" ${vm.hideWinPercent ? 'style="display:none;"' : ""}>${vm.getWinPercent()}</div>
        <div class="indicator ${!vm.getLast() ? "bad" : ""}"></div>
    `;
}

const defaultConfig = {
    template: winLossTemplate,
    name: "",
    hideWinPercent: false,
    tableLayout: false
};

export default class WinLoss extends QuickVis {
    constructor(config){
        config = Object.assign({}, defaultConfig, config);
        super(config);
        this.el.classList.add("win-loss");
        if(config.tableLayout){
            this.el.classList.add("table-layout");
        }
        this.name = config.name;
        this.hideWinPercent = config.hideWinPercent;
    }

    _update(data){
        if(!data || !data.length){
            throw new Error("cannot create graph bar from empty data");
        }

        this.data = data;
        let [total, win, loss] = this.data.reduce((acc, dp) => {
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
        return this.data.slice(-1)[0];
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
        return `${Math.floor(this.winPercent)}%`;
    }
}
