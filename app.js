const http = require("http");
const PORT = 3000;

http.createServer((req,res) => {
res.write('Hello world again');
	res.end();
}
).listen(PORT);

console.log(`server started on port ${PORT}`);
