/**
 * @author Shouding Xiang
 */

var root  = process.cwd();
var fs    = require("fs");
var http  = require("http");
var url   = require("url");
var querystring = require("querystring");

var Jaazlog = {
  options: {
    title:    "Jazzlog blog system",
    author:   "Shouding Xiang",
    version:  "1.0.0",
    server:   "Jaazlog Web Server (node.js)",
    query:    {}
  },

  heads: {},

  http: null,

  config: function(options) {
    if (typeof(options) == 'object') {
      options['title'] = options['title'] || this.options['title'];
      options['author'] = options['author'] || this.options['author'];
      this.options = options;
    }
  },

  get: function (role, callback) {
    this.options['query'][role] = callback;
  },

  post: function (role, callback) {
    this.options['query'][role] = callback;
  },

  update: function (uri, callback) {
    this.options['query'][role] = callback;
  },

  createServer: function () {
    var that = this;
    this.http = http.createServer(function(request, response) {
      that._call(request, response);
    });
    this.http.on('error', function (error) {
      console.log('error event');
    });
    return this;
  },

  listen: function(port) {
    var p = port || "8080";
    if (this.http) this.http.listen(p);
  },

  _call: function (request, response) {
    var f = true;
    console.log("== Req: " + request.url + " ===============");
    for (var role in this.options['query']) {
      var re = new RegExp(role, "ig");
      if (re.test(url.parse(request.url).path)) {
        response.writeHead(200, {"Content-Type": "text/html"});
        this.options['query'][role](request, response, querystring.parse(url.parse(request.url).query));
        f = false;
        break;
      }
    }
    if (f) this._static(request, response);
  },

  _type: function (file) {
    var ext = "";
    var type = "text/html";
    if (file.indexOf(".") !== -1) {
      ext = file.substr(file.indexOf(".") + 1);
      ext = ext.toLowerCase().trim();
      if (ext.length === 0) {
        type = "text/plain";
      } else if (ext === "png") {
        type = "image/png";
      } else if (ext === "jpg") {
        type = "image/jpeg";
      } else if (ext === "js") {
        type = "text/javascript";
      } else if (ext === "css") {
        type = "text/css";
      } else {
        type = "text/html";
      }
    }
    return type;
  },

  show404: function (request, response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Not found page!");
    response.end();
  },

  _static: function (request, response) {
    var path = root + url.parse(request.url).path;
    var that = this;
    console.log(path);
    fs.readFile(path, "binary", function (err, data) {
      if (err) {
        that.show404(request, response);
        return;
      }
      response.writeHead(200, {"Content-Type": that._type(path)});
      response.write(data, "binary");
      response.end();
    });
  }
};

exports.jaazlog = Jaazlog;
