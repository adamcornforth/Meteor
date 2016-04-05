import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';
import { Uploads } from '../api/images.js';

var image_id; 
var files;

FS.HTTP.setBaseUrl('/files');

Router.route('/upload', { where: 'server' })
  .get(function () {
    console.log('get upload');
  	var res = this.response;
  	res.end('Hello\n');
  })
  .post(function (data) {
    // console.log('post upload');
  	files = this.request.files;
    // console.log('files', files);
    var res = this.response;
    // console.log('res');
    if (true)
      // console.log('test');
      // Insert into the tasks collection
      Meteor.call('tasks.pi_insert', "Pi", function(err, _id) {
        // console.log(err);
        image_id = _id;
        var file = new FS.File();
      
        file.attachData(files[0].data, {type: files[0].mimeType},function(err){
            // console.log(err, Uploads);
            file.name(files[0].filename);

            Uploads.insert(file, function (err, fileObj) {
              // console.log(err);
              while(fileObj.url()==null);

              var resp = {
                'url': fileObj.S3Url("images"),
              };
              Meteor.call('tasks.setUrl', image_id, resp.url);
              res.end(JSON.stringify(resp));
            });
        });
      });

  	res.end('Uploading..?\n');
  });