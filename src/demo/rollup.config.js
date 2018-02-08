/* eslint-env node */
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const {ENTRY, DEST, TRANSPILE} = process.env;

if(!ENTRY || !DEST){
    console.error("Missing ENTRY or DEST");
    process.exit(1);
}

let plugins = [ resolve(), commonjs() ];
if(TRANSPILE){
    console.log("Transpiling...");
    plugins.push(babel());
}

let config = {
    input: ENTRY,
    output: {
        name: 'app',
        sourcemap: true,
        file: DEST,
        format: 'iife'
    },
    plugins: plugins
};

export default config;
