import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

// Helpers are used to pass data into templates
// The below code defines a helper called tasks that returns an array
Template.body.helpers({
	tasks() {
		return Tasks.find({}, { sort: { createdAt: -1} });
	}
});

// Events can listen for events such as the submit
// event on the .new-task CSS selector 
// The event handler function gets the 'event' 
// parameter which contains the triggered event 
// information, e.g. event.target is the form element
Template.body.events({
	'submit .new-task'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target; 
		const text = target.text.value; 

		// Insert into the tasks collection
		Tasks.insert({
			text,
			createdAt: new Date(),
		});

		// Clear form 
		target.text.value = '';
	},
});