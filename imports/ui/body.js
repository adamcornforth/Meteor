import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';
import { Images } from '../api/images.js';

import './task.js';
import './body.html';

// Set up a new ReactiveDict and attach it to the body
// template instance (where we'll store the checkbox's state)
Template.body.onCreated(function bodyOnCreated() {
	// Good for storing the UI state as ReactiveDict does
	// not sync with the server like collections do 
	this.state = new ReactiveDict(); 

	// Subscribe to the 'tasks' publication
	Meteor.subscribe('tasks'); 
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
	},
	files(){
      return S3.collection.find();
  }
});

// Events can listen for events such as the submit
// event on the .new-task CSS selector 
// The event handler function gets the 'event' 
// parameter which contains the triggered event 
// information, e.g. event.target is the form element
Template.body.events({
	'submit .new-task'(event) {
    const instance = Template.instance(); 

		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target; 
		const text = target.text.value; 

		// Insert into the tasks collection
		Meteor.call('tasks.insert', text, function(err, _id) {
      console.log("_id", _id);
      instance.state.set('_id', _id);

  		// Clear form 
  		target.text.value = '';

      // Get file (if there is one)
      var files = $("input.file_bag")[0].files

      // If we have a file, upload to S3
      if(files) {

        // Call the server to check if the S3 .env is configured
        Meteor.call('images.s3_set', function(err, s3_configured) {

          if(s3_configured) {
            console.log(instance.state.get('_id')); 
            // We only want to perform the upload if 
            // S3 is configured on the server
            S3.upload({files:files},function(e,r){
              console.log(r, instance.state.get('_id'));

              // Set the task URL 
              Meteor.call('tasks.setUrl', instance.state.get('_id'), r.url);
            });
          } 

        });

      }
    }); 


	},
	'change .hide-completed input'(event, instance) { 
		instance.state.set('hideCompleted', event.target.checked);
	},
});