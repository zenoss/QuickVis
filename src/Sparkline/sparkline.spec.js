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
});
