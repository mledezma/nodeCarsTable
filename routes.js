const cars = require('./controllers/cars');
const fs = require('fs');

// list of available routes for the server
const ROUTES = [
	{
		url: '/',
		method: 'GET',
		controller: (req, res) => {
		}
	},
	{
		url: '/cars',
		method: 'GET',
		controller: cars.getAll
	},
	{
		url: '/car',
		method: 'OPTIONS',
		controller: cars.options
	},
	{
		url: '/car',
		method: 'POST',
		controller: cars.create
	},
	{
		url: '/car',
		method: 'PUT',
		controller: cars.update
	},
	{
		url: '/car',
		method: 'DELETE',
		controller: cars.remove
	},
	{
		url: '/csv',
		method: 'POST',
		controller: cars.createCsv
	},
	{
		url: '/carStyles',
		method: 'POST',
		controller: cars.createStyles		
	},
	{
		url: '/carStyle',
		method: 'GET',
		controller: cars.getStyles		
	}
];

// 404 NOT FOUND DEFAULT ROUTE
const NOT_FOUND = {
	controller: (req, res) => {
		res.writeHead(404, {
			'Content-Type': 'text/html',
			'Access-Control-Allow-Origin': '*'
		});
		return res.end('Not found')
	}
}

module.exports = (req, res) => {
	let route = NOT_FOUND;
	ROUTES.forEach(r => {
		if(r.url === req.url && r.method === req.method)
			route = r;
			
	});
	return route.controller(req, res);
};