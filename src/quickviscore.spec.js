/* globals console: true */
/* jshint jasmine: true */
"use strict";

import QuickVis from "quickviscore";

describe("quickvis", () => {

    it("creates a DOM element", () => {
        let q = new QuickVis();
        expect(q.el instanceof HTMLElement).toBe(true);
    });

    it("uses the provided template", () => {
        let specialValue = "horseapples!";
        let q = new QuickVis({
            template: function(vm){ return specialValue; }
        });
        document.body.appendChild(q.el);
        q.render();
        expect(q.el.innerHTML).toContain(specialValue);
    });

    it("uses the provided data", () => {
        let data = ["horse", "apples", "time"];
        let q = new QuickVis({
            template: function(vm){
                return vm.data.join(" ");
            }
        });
        document.body.appendChild(q.el);
        q.render(data);
        expect(q.el.innerHTML).toContain(data.join(" "));

    });

    it("warns if render is called before attaching el to DOM", () => {
        console.warn = jasmine.createSpy("consoleWarn");
        let q = new QuickVis({});
        q.render();
        expect(console.warn).toHaveBeenCalled();
    });

    it("doesnt warn if render is called after attaching el to DOM", () => {
        console.warn = jasmine.createSpy("consoleWarn");
        let q = new QuickVis({});
        document.body.appendChild(q.el);
        q.render();
        expect(console.warn).not.toHaveBeenCalled();
    });

});
