// ---- Dependencies, "constants," and local vars ---- //
var io      = require('socket.io').listen(9876);
var sse     = require('connect-sse')();
var path    = require('path');
var http    = require('http');
var express = require('express');

var report = require('public/lib/report');

var NUM_MESSAGES = 10000;
var NUM_TESTS    = 100;
var EVENT        = {type: "event", message: "test"};

var app = express();

// ---- Configuration ---- //
app.configure( function () {
  app.use(express.static(path.join(__dirname, 'public')));
});

io.configure( function () {
  io.set('log level', 0); // error messages only
});

// ---- ---- //
function runTests(self, f) {
    var results = [];
    var start;
    var end;
    var i;
    var j;

    for (i = 0; i < NUM_TESTS; i++) {
      start = new Date();

      for (j = 0; j < NUM_MESSAGES; j++) {
        f.apply(self, EVENT);
      }

      end = new Date();

      results.push(end - start);
    }

    return results;
  }

// ---- The socket.io test ---- //
io.sockets.on('connection', function (socket) {
  var results = runTests(socket, socket.send);
  console.log('\nSocket.io (ms)');
  console.log(NUM_TESTS + ' iterations each sending ' + NUM_MESSAGES + ' events');
  report.report(results);
});

// ---- The Server Sent Events test ---- //
app.get('/event-test', sse, function (request, response) {
  var results = runTests(response, response.json);
  console.log('\nSSE (ms)');
  console.log(NUM_TESTS + ' iterations each sending ' + NUM_MESSAGES + ' events');
  report.report(results);
});

// ---- Start the HTTP server ---- //
http.createServer(app).listen(9877, function () {
  console.log('Express server listening on port 9877');
});
