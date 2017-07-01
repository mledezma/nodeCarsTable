(function($, window) {
	// constants
	const BASE_URL = 'http://localhost:8080'; // server
	
	// variables
	var form = null;
	var table = null;
	var styleForm = null;
	var exportCsv = null;
	var select = null;

	/**
	 * Load the car table
	 * If data is passed the uses the data to load the table
	 * If data is not passed then request the data to the server
	 * @param {Object} data optional
	 * @private
	 */
	function _loadTable(data) {
		// clear the table content
		table.find('tbody').html('');
		
		if(!data) {
			$.ajax({
				url: BASE_URL+'/cars',
				type: 'GET'
			}).then(_composeTBody, _logError);
		}
		else {
			_composeTBody(data);
		}
	}
	
	/**
	 * Compose the tbody for the cars table
	 * @param {Array} data
	 * @private
	 */
	function _composeTBody(data) {
		var tbody = $('<tbody></tbody>');
		
		// there are no cars
		if(!data.total){
			tbody.append($('<tr><th colspan="8" class="text-center">There are no cars.</th></tr>'));
			return table.append(tbody);
		}
		
		// create the tds for echa car
		data.records.forEach(function(car) {
			var tr = $('<tr></tr>');
			tr.append($('<th>#'+car.id+'</th>'));
			tr.append($('<td>'+car.model+'</td>'));
			tr.append($('<td>'+car.brand+'</td>'));
			tr.append($('<td>'+car.year+'</td>'));
			tr.append($('<td>'+car.price+'</td>'));
			tr.append($('<td>'+car.color+'</td>'));
			tr.append($('<td>'+car.styleCar+'</td>'));
			var actions = $('<td width="150px"></td>');
			actions.append(_composeEditButton(car));
			actions.append(_composeDeleteButton(car));
			tr.append(actions);
			tbody.append(tr);
		});
		table.append(tbody);
	}
	
	/**
	 * Compose the styles select input for the cars form
	 * @param {Array} data
	 * @private
	 */
	function _composeStylesInput(data) {
		select.html('');
		data.records.forEach(function(style) {
			var option = $('<option></option>');
			option.text(style.name);
			select.append(option);
		});
	}

	/**
	 * Update the styles input
	 * If data is passed then uses the data to update the input
	 * If data is not passed then request the data to the server
	 * @param {Object} data optional
	 * @private
	 */
	function _updateSelect(data) {
		// clear the table content
		select.html('');
		
		if(!data) {
			$.ajax({
				url: BASE_URL+'/carStyle',
				type: 'GET'
			}).then(_composeStylesInput, _logError);
		}
		else {
			_composeStylesInput(data);
		}
	}

	/**
	 * Compose the delete button for each car row
	 * @param {Object} car
	 * @returns {*|HTMLElement}
	 * @private
	 */
	function _composeDeleteButton(car) {
		var button = $('<button class="btn btn-sm btn-danger pull-right">Delete</button>');
		button.on('click', function() {
			var message = 'Are you sure you want to delete '+car.model+' '+car.brand+' '+car.year+' '+car.price+' '+car.color+' '+car.styleCar;
			message += "\nThis action will delete the car permanently."
			if(confirm(message)) _deleteCar(car.id);
		});
		return button;
	}
	
	/**
	 * Delete the car
	 * @param {String|Number} id car id
	 * @private
	 */
	function _deleteCar(id) {
		$.ajax({
			url: BASE_URL+'/car',
			type: 'DELETE',
			data: {id: id}
		}).then(_loadTable, _logError);
	}
	
	/**
	 * Compose the edit button for each car row
	 * @param {Object} car
	 * @returns {*|HTMLElement}
	 * @private
	 */
	function _composeEditButton(car) {
		var button = $('<button class="btn btn-sm btn-primary">Edit</button>');
		button.on('click', function() {
			// load the data into the form
			form[0].id.value = car.id;
			form[0].model.value = car.model;
			form[0].brand.value = car.brand;
			form[0].year.value = car.year;
			form[0].price.value = car.price;
			form[0].color.value = car.color;
			form[0].styleCar.value = car.styleCar;
		});
		return button
	}
	
	/**
	 * Submits the add/edit car form
	 * @param {Object} event
	 * @private
	 */
	function _submitForm(event) {
		event.preventDefault();
		var data = {
			id: form[0].id.value,
			model: form[0].model.value,
			brand: form[0].brand.value,
			year: form[0].year.value,
			price: form[0].price.value,
			color: form[0].color.value,
			styleCar: form[0].styleCar.value,
		}
		
		$.ajax({
			url: BASE_URL+'/car',
			type: data.id == 0 ? 'POST' : 'PUT',
			data: data
		}).then(
			function (data){
				form[0].reset();
				_loadTable(data);
			},
			_logError
		);
	}

	/**
	 * Submits the add car style form
	 * @param {Object} event
	 * @private
	 */
	function _submitStyleForm(event) {
		event.preventDefault();
		var data = {
			description: styleForm[0].description.value,
			name: styleForm[0].nameStyle.value,
		}
		
		$.ajax({
			url: BASE_URL+'/carStyles',
			type: 'POST',
			data: data
		}).then(
			function (data){
				styleForm[0].reset();
				_updateSelect(data);
			},
			_logError
		);
	}

	function _composeBtnCsv() {
		exportCsv.on('click', function () {
			$.ajax({
				url: BASE_URL+'/csv',
				type: 'POST',
			})
			alert('The CSV has been saved'); //Dudas no funca con el then dunno why	
		});
	}
	
	/**
	 * Simple method to log errors
	 * @param {Error|Object} error
	 * @private
	 */
	function _logError(error){
		console.error(error);
	}

	/**
	 * Simple method to toggle the visibility
	 * @private
	 */
	function _toggleVisibility(){
		$('#btn-carForm').on('click', function(){
			$('#carStyleContainer').addClass('hidden');
			$('#carFormContainer').removeClass('hidden');	
		});
		$('#btn-carStyle').on('click', function(){
			$('#carFormContainer').addClass('hidden');
			$('#carStyleContainer').removeClass('hidden');			
		});
	}

	/**
	 * Starts the app
	 * @private
	 */
	function _init() {
		form = $('#carForm');
		table = $('#cars');
		styleForm = $('#styleForm');
		exportCsv = $('#exportCsv');
		select = $('#styleCar');
		_loadTable();
		_composeBtnCsv();
		_updateSelect();
		_toggleVisibility();
		form.on('submit', _submitForm);
		styleForm.on('submit', _submitStyleForm);
	}
	
	_init();
})(jQuery, window);