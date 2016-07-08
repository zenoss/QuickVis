/* jshint jasmine: true */
"use strict";

import {linearScale, createSVGNode, getFormattedNumber} from "utils";

describe("utils", () => {

    describe("linearScale", () => {
        it("does basic linear scaling", () => {
            let scale = linearScale([0,1], [0,100]);
            expect(scale(0.5)).toEqual(50);
        });

        it("scales out of bounds", () => {
            let scale = linearScale([0,1], [0,100]);
            expect(scale(2)).toEqual(200);
        });

        it("clamps bounds", () => {
            let scale = linearScale([0,1], [0,100], true);
            expect(scale(2)).toEqual(100);
        });

        it("handles reverse scales", () => {
            let scale = linearScale([0,1], [100,0]);
            expect(scale(0.25)).toEqual(75);
            let scale2 = linearScale([1,0], [0,100]);
            expect(scale2(0.25)).toEqual(75);
        });

        it("handles negative numbers", () => {
            let scale = linearScale([-1,1], [0,100]);
            expect(scale(0)).toEqual(50);
            let scale2 = linearScale([0,1], [-100,100]);
            expect(scale2(0.5)).toEqual(0);
        });

        it("short circuits an empty domain", () => {
            let scale = linearScale([1,1], [50,100]);
            expect(scale(0)).toEqual(50);
            expect(scale(1)).toEqual(50);
            expect(scale(2)).toEqual(50);
        });

        it("short circuits an empty range", () => {
            let scale = linearScale([0,1], [50,50]);
            expect(scale(0)).toEqual(50);
            expect(scale(1)).toEqual(50);
            expect(scale(2)).toEqual(50);
        });
    });

    describe("createSVGNode", () => {
        it("creates an SVGElement", () => {
            let path = createSVGNode("path", {});
            expect(path instanceof SVGElement).toBe(true);
        });

        it("sets provided attributes on the element", () => {
            let circle = createSVGNode("circle", {
                cx: 10,
                cy: 15,
                r: 5,
                strokeWidth: 1000
            });
            expect(circle.getAttribute("cx")).toBe("10");
            expect(circle.getAttribute("stroke-width")).toBe("1000");
        });

    });

    describe("getFormattedNumber", () => {
        it("returns a value and order of magnitude", () => {
            expect(getFormattedNumber(1)[0]).toEqual(1);
            expect(getFormattedNumber(1)[1]).toEqual("");
            expect(getFormattedNumber(999)[0]).toEqual(999);
            expect(getFormattedNumber(999)[1]).toEqual("");
            expect(getFormattedNumber(1000)[0]).toEqual(1);
            expect(getFormattedNumber(1000)[1]).toEqual("K");
            expect(getFormattedNumber(-1)[0]).toEqual(-1);
            expect(getFormattedNumber(-1)[1]).toEqual("");
        });
        it("shortens long floats", () => {
            expect(getFormattedNumber(0.1)[0]).toEqual(0.1);
            expect(getFormattedNumber(0.01)[0]).toEqual(0);
            expect(getFormattedNumber(1.01)[0]).toEqual(1);
            expect(getFormattedNumber(-1.01)[0]).toEqual(-1);
        });
    });
});
