const fs = require('fs');

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if(url === '/') {
		res.write('<html>');
		res.write('<body>Whats your name? <form method="POST" action="/message"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
		res.write('</html>');
		return res.end();
	}

	if (url === '/message' && method === 'POST') {
		const body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		});
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];
			fs.writeFile('message.txt', message, (err) => {
				res.writeHead(302, {
					location: '/'
				});
				return res.end();
			});
		})
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<body>Hello,</body>');
	res.write('</html>');
	res.end();
};

module.exports = requestHandler;