/* jshint jasmine: true */
"use strict";

import Sparkline from "Sparkline";

describe("Sparkline", () => {

    it("calculates average value of provided data", () => {
        let vals = [1,2,3,4],
            avg = vals.reduce((acc, val) => acc+val, 0) / vals.length;

        let sparky = new Sparkline({});
        sparky.render(vals);
        expect(sparky.avg).toEqual(avg);
    });

    it("calculates the delta between the last point and the average", () => {
        let vals = [1,2,3,4],
            avg = vals.reduce((acc, val) => acc+val, 0) / vals.length,
            delta = vals[vals.length-1] - avg;

        let sparky = new Sparkline({});
        sparky.render(vals);
        expect(sparky.delta).toEqual(delta);
    });

    it("throws an error on empty data", () => {
        let sparky = new Sparkline({});
        expect(() => sparky.render([])).toThrow();
    });

    it("sets up x and y scales with built-in padding", () => {
        // NOTE - if this changes in Sparkline,
        // it will need to change here
        const SPARKLINE_PADDING = 4;
        const SPARKLINE_DATA_PADDING = 1;

        let sparky = new Sparkline({}),
            data = [0,1,2,3],
            width = 400,
            height = 100;

        sparky.data = data;
        sparky.setScales(width, height);

        expect(sparky.xScale(data[0])).toEqual(SPARKLINE_PADDING);
        expect(sparky.xScale(data[data.length-1])).toEqual(width-SPARKLINE_PADDING);
    });

    it("sets up drawable area with built-in padding", () => {
        // NOTE - if this changes in Sparkline,
        // it will need to change here
        const SPARKLINE_PADDING = 4;
        const SPARKLINE_DATA_PADDING = 1;

        let sparky = new Sparkline({}),
            data = [0,1,2,3],
            width = 400,
            height = 100;

        sparky.data = data;
        sparky.setScales(width, height);
        sparky.setDrawableArea(width, height);

        expect(sparky.drawableArea.x1).toEqual(SPARKLINE_PADDING);
        expect(sparky.drawableArea.x2).toEqual(width-SPARKLINE_PADDING);
        expect(sparky.drawableArea.y1).toEqual(SPARKLINE_PADDING);
        expect(sparky.drawableArea.y2).toEqual(height-SPARKLINE_PADDING);
        expect(sparky.drawableArea.width).toEqual(width - (2*SPARKLINE_PADDING));
        expect(sparky.drawableArea.height).toEqual(height - (2*SPARKLINE_PADDING));
    });

    it("shortens long decimal numbers", () => {
        let sparky = new Sparkline({});
        expect(sparky.getFriendly(0.1)).toEqual(0.1);
        expect(sparky.getFriendly(0.01)).toEqual(0);
        expect(sparky.getFriendly(0.001)).toEqual(0);
    });

    it("friendly-ly reduces numbers to range 1 - 999", () => {
        let sparky = new Sparkline({});
        expect(sparky.getFriendly(1)).toEqual(1);
        expect(sparky.getFriendly(100)).toEqual(100);
        expect(sparky.getFriendly(999)).toEqual(999);
        expect(sparky.getFriendly(1000)).toEqual(1);
        expect(sparky.getFriendly(1000000)).toEqual(1);
        expect(sparky.getFriendly(-1)).toEqual(-1);
        expect(sparky.getFriendly(-100)).toEqual(-100);
        expect(sparky.getFriendly(-999)).toEqual(-999);
        expect(sparky.getFriendly(-1000)).toEqual(-1);
        expect(sparky.getFriendly(-1000000)).toEqual(-1);
    });

    it("returns the magnitude of a number", () => {
        let sparky = new Sparkline({});
        expect(sparky.getMagnitude(1)).toEqual("");
        expect(sparky.getMagnitude(1000)).toEqual("K");
        expect(sparky.getMagnitude(1000000)).toEqual("M");
        expect(sparky.getMagnitude(-1)).toEqual("");
        expect(sparky.getMagnitude(-1000)).toEqual("K");
        expect(sparky.getMagnitude(-1000000)).toEqual("M");
        // less than one will always return ""
        expect(sparky.getMagnitude(0.1)).toEqual("");
    });

    it("returns a friendly delta value with correct magnitude", () => {
        let vals = [2,4000],
            friendlyDelta = "1.9K";

        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render(vals);
        expect(sparky.getFriendlyDelta()).toEqual(friendlyDelta);
    });

    it("returns a friendly delta that ain't too long", () => {
        let vals = [0,0.01],
            friendlyDelta = "0";

        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render(vals);
        expect(sparky.getFriendlyDelta()).toEqual(friendlyDelta);
    });

    it("returns delta direction up arrow, up class", () => {
        let vals = [0,1];

        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render(vals);
        expect(sparky.getDeltaDirectionArrow()).toEqual("▴");
        expect(sparky.getDeltaDirectionClass()).toEqual("up");
    });

    it("returns no delta direction arrow or class", () => {
        let vals = [0,0];

        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render(vals);
        expect(sparky.getDeltaDirectionArrow()).toEqual("");
        expect(sparky.getDeltaDirectionClass()).toEqual("");
    });

    it("returns delta direction down arrow, down class", () => {
        let vals = [1,0];

        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render(vals);
        expect(sparky.getDeltaDirectionArrow()).toEqual("▾");
        expect(sparky.getDeltaDirectionClass()).toEqual("down");
    });

    it("identifies if the last value exceeds the threshold", () => {
        let sparky = new Sparkline({
            threshold: 3
        });
        document.body.appendChild(sparky.el);

        sparky.render([1,2,3,4]);
        expect(sparky.lastExceedsThreshold()).toBe(true);

        sparky.render([1,2,3,2]);
        expect(sparky.lastExceedsThreshold()).toBe(false);
    });

    it("returns indicator status, based on threshold", () => {
        let sparky = new Sparkline({
            threshold: 3
        });
        document.body.appendChild(sparky.el);

        sparky.render([1,2,3,4]);
        expect(sparky.getIndicatorStatus()).toBe("on");

        sparky.render([1,2,3,2]);
        expect(sparky.getIndicatorStatus()).toBe("off");
    });

    it("sets threshold to Infinity if none is provided", () => {
        let sparky = new Sparkline({});
        document.body.appendChild(sparky.el);
        sparky.render([1,2,3,Number.MAX_VALUE]);
        expect(sparky.lastExceedsThreshold()).toBe(false);
    });

});
