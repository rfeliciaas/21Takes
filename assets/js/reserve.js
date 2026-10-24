// Reservation form: check the fields, then show a confirmation.

//  Find the parts of the page we need
var form = document.getElementById('rf-form');
var confirmBox = document.getElementById('rf-confirm');
var summary = document.getElementById('rf-summary');
var againButton = document.getElementById('rf-again');

var nameInput = document.getElementById('rf-name');
var contactInput = document.getElementById('rf-contact');
var branchInput = document.getElementById('rf-branch');
var dateInput = document.getElementById('rf-date');
var timeInput = document.getElementById('rf-time');
var guestsInput = document.getElementById('rf-guests');


// Small helper functions

// turns 5 into "05" so dates look like 2026-03-05
function twoDigits(number) {
	if (number < 10) {
		return '0' + number;
	}
	return '' + number;
}

// today's date in the same format the date box uses (YYYY-MM-DD)
function getToday() {
	var now = new Date();
	return now.getFullYear() + '-' + twoDigits(now.getMonth() + 1) + '-' + twoDigits(now.getDate());
}

// shows a red message under a field
function showError(input, message) {
	input.parentNode.classList.add('invalid');
	document.getElementById(input.id + '-err').textContent = message;
}

// removes the red messages from every field
function clearErrors() {
	var inputs = [nameInput, contactInput, branchInput, dateInput];
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].parentNode.classList.remove('invalid');
		document.getElementById(inputs[i].id + '-err').textContent = '';
	}
}

// adds one line (like "Name: Sam") to the confirmation list
function addRow(label, value) {
	var item = document.createElement('li');
	var left = document.createElement('span');
	var right = document.createElement('span');
	left.textContent = label;
	right.textContent = value;
	item.appendChild(left);
	item.appendChild(right);
	summary.appendChild(item);
}


// Don't let visitors pick a date in the past
dateInput.min = getToday();


// When the form is sent, check everything
form.addEventListener('submit', function (event) {
	event.preventDefault();   // stop the page from reloading
	clearErrors();

	var allGood = true;

	// name: at least 2 letters
	if (nameInput.value.trim().length < 2) {
		showError(nameInput, 'Enter your full name.');
		allGood = false;
	}

	// contact: must look like an email OR a phone number
	var contact = contactInput.value.trim();
	var looksLikeEmail = contact.indexOf('@') > 0 && contact.lastIndexOf('.') > contact.indexOf('@') + 1;
	var digits = contact.replace(/\D/g, '');                       // keep only the numbers
	var looksLikePhone = /^[0-9 +()-]+$/.test(contact) && digits.length >= 8;

	if (!looksLikeEmail && !looksLikePhone) {
		showError(contactInput, 'Enter a valid email address or phone number.');
		allGood = false;
	}

	// branch: must be chosen
	if (branchInput.value === '') {
		showError(branchInput, 'Choose a branch.');
		allGood = false;
	}

	// date: must be chosen and not in the past
	if (dateInput.value === '') {
		showError(dateInput, 'Choose a date.');
		allGood = false;
	} else if (dateInput.value < getToday()) {
		showError(dateInput, 'Choose today or a later date.');
		allGood = false;
	}

	// if everything is fine, show the confirmation
	if (allGood) {
		summary.innerHTML = '';   // empty the list first
		addRow('Name', nameInput.value.trim());
		addRow('Contact', contact);
		addRow('Branch', branchInput.value);
		addRow('Date', dateInput.value);
		addRow('Time', timeInput.value);
		addRow('Guests', guestsInput.options[guestsInput.selectedIndex].text);

		form.hidden = true;
		confirmBox.hidden = false;
	}
});


//  "Make another reservation" button
againButton.addEventListener('click', function () {
	form.reset();
	clearErrors();
	confirmBox.hidden = true;
	form.hidden = false;
});