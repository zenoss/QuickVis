/* eslint-env node */

const {ENTRY, DEST} = process.env;

if(!ENTRY || !DEST){
    console.error("Missing ENTRY or DEST");
    process.exit(1);
}

let config = {
    input: ENTRY,
    name: 'quickvis',
    sourcemap: true,
    output: {
        file: DEST,
        format: 'iife'
    }
};

export default config;
