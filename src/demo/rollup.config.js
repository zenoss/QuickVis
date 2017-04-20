/* jshint node: true */
const {ENTRY, DEST} = process.env;

if(!ENTRY || !DEST){
    console.error("Missing ENTRY or DEST");
    process.exit(1);
}

let config = {
    entry: ENTRY,
    dest: DEST,
    moduleName: 'app',
    format: 'iife',
    sourceMap: true
};

export default config;
