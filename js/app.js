/**
 * 一个简单的例子，route用正则进行匹配
 * @author Shouding Xiang
 */
var app = require(process.cwd() + "/jaazlog.js").jaazlog;
var qs  = require("querystring");
var fs  = require("fs");
var url = require("url");

app.get("^/$", function(req, res) {
  fs.readFile('data/index.html', function (err, data) {
    res.write(data);
    res.end();
  });
});

app.get("^/index$", function(req, res) {
  res.write("My name is XiangShouding");
  res.end();
});

app.get("^/get/page\\?id=[0-9]+$", function (req, res, reqdata) {
  res.write(reqdata['id']);
  res.end();
});

app.get("^/add\\?a=[0-9]+&b=[0-9]+$", function (req, res, reqdata) {
  console.log(reqdata);
  var s = parseFloat(reqdata['a']) + parseFloat(reqdata['b']);
  console.log(s);
  res.write("" + s);
  res.end();
});

app.createServer().listen();
