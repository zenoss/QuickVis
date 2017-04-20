"use strict";

// polyfill es7 things
import "babel-polyfill";

import Sparkline from "./Sparkline/Sparkline";
import StackedBar from "./StackedBar/StackedBar";
import Bar from "./Bar/Bar";
import WinLoss from "./WinLoss/WinLoss";
import VisGrid from "./VisGrid/VisGrid";

export default {
    Sparkline,
    StackedBar,
    WinLoss,
    Bar,
    VisGrid
};
