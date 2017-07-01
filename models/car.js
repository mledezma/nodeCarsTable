const PATH = __dirname+'/../data/cars.json';

module.exports = Car;

/**
 * Car Model
 * @param {Object} data
 * @constructor
 */
function Car(data = {model: '', brand: '', year: 0}) {
	var self = this;
	self.id = _getId(data.id);
	self.model = data.model;
	self.brand = data.brand;
	self.year = data.year;
	self.price = data.price;
	self.color = data.color;
	self.styleCar = data.styleCar;
	
	self.valid = function() {
		let year = +self.year;
		let price = +self.price;
		if(self.model === '' || self.brand === '' || isNaN(year) || isNaN(price) || self.color === '' || self.styleCar === '')
			return false;
		return true;
	}
}

/**
 * Get the id for the car
 * If the id is valid use the passed id
 * If the id is not defined finds the counter or start a new counter
 * @param {Number} id
 * @returns {Number}
 * @private
 */
function _getId(id) {
	if(id > 0) return id;
	let data = '';
	try {
		data = require(PATH);
	} catch (err){ // file is empty
		return 1;
	}
	return ++data.counter;
}