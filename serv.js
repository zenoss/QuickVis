var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");


var db = [];

function generateMockData(){
    var now = new Date().getTime(),
        last = now,
        magnitude = 100;

    // generate 4 hours of mock data at 1 second intervals
    for(var i = 0; i < 60 * 60 * 4; i++){
        last -= 1000;
        db.push({
            timestamp: last,
            value: Math.floor(Math.sin(last) * magnitude)
        });
        magnitude *= 1.0001;
    }

    db.reverse();

    console.log("generated", db.length, "mock data things for range", last, "through", now);
}

// the slowest possible search function
function getMockDataRange(start, end){
    var result = [],
        item;

    // default to entire range
    start = start || 0;
    end = end || db[db.length-1].timestamp;

    for(var i = 0; i < db.length; i++){
        item = db[i];
        // heres the first chunk o data
        if(item.timestamp >= start){
            // not at the end yet?
            if(item.timestamp <= end){
                result.push(item);

            // at the end, all done
            } else {
                break;
            }
        }
    }
    console.log("found", result.length, "results");
    return result;
}


module.exports = function(dir, port){
    port = port || 3006;
    dir = dir ? path.join(process.cwd(), dir) : process.cwd();

    http.createServer(function(req, res){
        var uri = url.parse(req.url).pathname,
            filename = path.join(dir, uri);

        // roll your own RESTy api, wheee
        if(uri.substr(0, 4) === "/api"){
            handleAPIRequest(req, res);
            return;
        }

        fs.exists(filename, function(exists){
            if(!exists){
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("404 Not Found\n");
                res.end();
                return;
            }

            if(fs.statSync(filename).isDirectory()){
                filename += "index.html";
            }

            fs.readFile(filename, "binary", function(err, file){
                if(err){
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.write(err + "\n");
                    res.end();
                    return;
                }

                res.setHeader("Content-Type", getContentType(filename));
                res.writeHead(200);
                res.write(file, "binary");
                res.end();
            });
        });
    }).listen(parseInt(port, 10));

    console.log("Serving directory", dir, "on port", port);

    generateMockData();
};

function getContentType(fileName) {
    var ext = fileName.slice(fileName.lastIndexOf('.')),
        type;

    switch (ext) {
        case ".html":
            type = "text/html";
            break;

        case ".js":
            type = "text/javascript";
            break;

        case ".css":
            type = "text/css";
            break;

        default:
            type = "text/plain";
            break;
    }

    return type;
}

function handleAPIRequest(req, res){

    var method = req.method,
        parsed = url.parse(req.url, true),
        path = parsed.pathname.split("/").slice(2),
        query = parsed.query;

    console.log(method + "ing", path);

    if(method === "GET" && path[0] === "graph"){
        // TODO - verify start and end
        var results = getMockDataRange(+query.start, +query.end);
        res.setHeader("Content-Type", "text/json");
        res.writeHead(200);
        res.write(JSON.stringify(results));
        res.end();
        return;
    }

    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("404 Not Found\nCould not find '"+ path[0] +"'");
    res.end();
}
