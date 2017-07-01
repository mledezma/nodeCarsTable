const PATH = __dirname+'/../data/carStyle.json';

module.exports = CarStyles;

/**
 * CarStyles Model
 * @param {Object} data
 * @constructor
 */
function CarStyles(data = {description: '', name: ''}) {
	var self = this;
	self.description = data.description;    
	self.name = data.name;
	
	self.valid = function() {
		if(self.name === '') {
			return false;
        }
		return true;
	}
}