import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';
import { Uploads } from '../api/images.js';

var image_id; 
var files;

Router.route('/upload', { where: 'server' })
  .post(function (data) {
  	files = this.request.files;
    var res = this.response;

    // Insert into the tasks collection
    Meteor.call('tasks.pi_insert', "Pi", function(err, _id) {

      image_id = _id;
      var file = new FS.File();
    
      file.attachData(files[0].data, {type: files[0].mimeType},function(err){
          file.name(files[0].filename);

          Uploads.insert(file, function (err, fileObj) {
            while(fileObj.url()==null);

            var resp = {
              'url': fileObj.S3Url("images"),
            };
            Meteor.call('tasks.setUrl', image_id, resp.url);
            res.end(JSON.stringify(resp));
          });
      });

  	res.end('File uploaded\n');
  });

});