import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

// Set up a new ReactiveDict and attach it to the body
// template instance (where we'll store the checkbox's state)
Template.body.onCreated(function bodyOnCreated() {
	// Good for storing the UI state as ReactiveDict does
	// not sync with the server like collections do 
	this.state = new ReactiveDict(); 
});

// Helpers are used to pass data into templates
// The below code defines a helper called tasks that returns an array
Template.body.helpers({
	tasks() {
		const instance = Template.instance(); 
		if(instance.state.get('hideCompleted')) {
			// If hide completed is checked, filter tasks 
			return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1} });
		}
		return Tasks.find({}, { sort: { createdAt: -1 } });
	},
	incompleteCount() {
		return Tasks.find({ checked: { $ne: true } }).count();
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
	'change .hide-completed input'(event, instance) { 
		instance.state.set('hideCompleted', event.target.checked);
	},
});