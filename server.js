const PORT = 8888;

const http = require("http");
const url = require("url");
const fs = require("fs");
const open = require("open");
const types = {
  css: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml",
};
const path = require("path");

const server = http.createServer(function (request, response) {
  const pathname = url.parse(request.url).pathname.slice(1);
  const realPath = [`index.html`].includes(pathname)
    ? path.join("demo/", pathname)
    : Object.getOwnPropertyNames(types).includes(pathname.split(`.`).pop())
    ? pathname
    : pathname + `.js`;
  //console.log(realPath);
  let ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : "unknown";
  fs.exists(realPath, function (exists) {
    if (!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain",
      });

      response.write(
        "This request URL " + pathname + " was not found on this server."
      );
      response.end();
    } else {
      fs.readFile(realPath, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, {
            "Content-Type": "text/plain",
          });
          response.end();
        } else {
          const contentType = types[ext] || "text/plain";
          response.writeHead(200, {
            "Content-Type": contentType,
          });
          response.write(file, "binary");
          response.end();
        }
      });
    }
  });
});
server.listen(PORT);

open(`http://localhost:8888/index.html`);
