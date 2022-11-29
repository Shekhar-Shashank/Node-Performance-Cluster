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

app.listen(port, () => {
console.log(`App listening on port ${port}`);
});