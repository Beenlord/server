const http = require('http')
const path = require('path')
const fs = require('fs')

const hostroot = 'htdocs' // Папка
const hostname = '127.0.0.1' // Хост
const port = 6544 // Порт для сервера

const router = uri => {
	let file = path.resolve(hostroot, 'index.html')

	return new Promise((res, rej) => {
		if (!!uri.slice(1)) {
			file = path.resolve(hostroot, uri.slice(1))
		}
		const st = fs.statSync(file)
		if (st.isDirectory()) {
			file = path.resolve(file, 'index.html')
		}

		readFile(file).then(res).catch(rej)
	})

	if (uri !== '/') {
		file = path.resolve(hostroot, uri)
		const st = fs.stat(file)
		if (st.isDirectory()) {
			file = path.resolve(file, 'index.html')
		}
		if (!fs.existsSync(file)) {
			throw new Error(`Ошибка чтения файла ${file}`)
		}
	}

	console.log(file)
}

const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/html')

	router(req.url)
		.then(html => res.end(html))
		.catch(() => {
			res.statusCode = 404
			res.end('<h3>Err.</h3><p>Ошибка пути к файлу.</p>')
		})
})

function readFile(path) {
	return new Promise((res, rej) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) {
				rej(err)
			}
			res(data)
		})
	})
}

// Запускаем сервер
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
