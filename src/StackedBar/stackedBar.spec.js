/* jshint jasmine: true */
"use strict";

import StackedBar from "StackedBar";

describe("StackedBar", () => {

    it("throws an error on empty data", () => {
        let stacked = new StackedBar({});
        expect(() => stacked.render([])).toThrow();
    });

    it("shortens long decimal numbers", () => {
        let stacked = new StackedBar();
        expect(stacked.getFormattedNumber(0.1)).toEqual("0.1");
        expect(stacked.getFormattedNumber(0.01)).toEqual("0");
        expect(stacked.getFormattedNumber(0.001)).toEqual("0");
    });

    it("humanizes numbers", () => {
        let stacked = new StackedBar({});
        expect(stacked.getFormattedNumber(1)).toEqual("1");
        expect(stacked.getFormattedNumber(100)).toEqual("100");
        expect(stacked.getFormattedNumber(999)).toEqual("999");
        expect(stacked.getFormattedNumber(1000)).toEqual("1K");
        expect(stacked.getFormattedNumber(1000000)).toEqual("1M");
    });

    it("sets capacity if none is provided", () => {
        let stacked = new StackedBar(),
            vals = [{val:1}, {val:2}, {val:3}, {val:4}];
        document.body.appendChild(stacked.el);
        stacked.render(vals);
        expect(stacked.capacity).toBe(vals.reduce((acc,v) => acc + v.val, 0));
    });

    it("raises capacity if total exceeds it", () => {
        let stacked = new StackedBar({
            capacity: 5 
        });
        let vals = [{val:1}, {val:2}, {val:3}, {val:4}];
        document.body.appendChild(stacked.el);
        stacked.render(vals);
        expect(stacked.capacity).toBe(vals.reduce((acc,v) => acc + v.val, 0));
    });

    it("identifies if the last value exceeds the threshold", () => {
        let stacked = new StackedBar({
            threshold: 15
        });
        document.body.appendChild(stacked.el);

        stacked.render([{val:1}, {val:2}, {val:3}, {val:4}]);
        expect(stacked.exceedsThreshold()).toBe(false);

        stacked.render([{val:5}, {val:6}, {val:7}, {val:8}]);
        expect(stacked.exceedsThreshold()).toBe(true);
    });

    it("returns indicator status, based on threshold", () => {
        let stacked = new StackedBar({
            threshold: 15
        });
        document.body.appendChild(stacked.el);

        stacked.render([{val:1}, {val:2}, {val:3}, {val:4}]);
        expect(stacked.getIndicatorStatus()).toBe("off");

        stacked.render([{val:5}, {val:6}, {val:7}, {val:8}]);
        expect(stacked.getIndicatorStatus()).toBe("on");
    });

    it("disables threshold if it exceeds user-specified capacity", () => {
        let stacked = new StackedBar({
            threshold: 100
        });
        let vals = [{val:1}, {val:2}, {val:3}, {val:4}];
        document.body.appendChild(stacked.el);
        stacked.render(vals);
        expect(stacked.threshold).toBe(0);
    });

    it("calculates percentage of capacity that a threshold represents", () => {
        let stacked = new StackedBar({
            capacity: 20,
            threshold: 2
        });
        let vals = [{val:1}, {val:2}, {val:3}, {val:4}];
        document.body.appendChild(stacked.el);
        stacked.render(vals);
        expect(stacked.getThresholdPosition()).toBe(10);
    });


    it("calculates free space", () => {
        let stacked = new StackedBar({
            capacity: 20
        });
        let vals = [{val:1}, {val:2}, {val:3}, {val:4}];
        document.body.appendChild(stacked.el);
        stacked.render(vals);
        expect(stacked.free).toBe(10);
    });


});
