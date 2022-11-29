process.env.UV_THREADPOOL_SIZE = 8;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed again but in child mode
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    // cluster.fork();
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  // I'm a child, I'm going to act like a server and do nothing
  const express = require("express");
  const crypto = require('crypto');
  const app = express();
  const port = 3000;
  console.log(`Worker ${process.pid} started`);
 
  app.get("/", (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send(`Hello World! ${process.pid}`);
    });
  });

  app.get("/fast", (req, res) => {
    res.send(`This was Fast! ${process.pid}`)
  })
 
  // app.get("/api/:n", function (req, res) {
  //   let n = parseInt(req.params.n);
  //   let count = 0;
 
  //   if (n > 5000000000) n = 5000000000;
 
  //   for (let i = 0; i <= n; i++) {
  //     count += i;
  //   }
 
  //   res.send(`${process.pid} Final count is ${count}`);
  // });
 
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}