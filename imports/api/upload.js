import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';
import { Images } from '../api/images.js';

var image_id; 
var files;
var Uploads = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "~/Code/Meteor/public/images~/"})]
});

FS.HTTP.setBaseUrl('/files');

Router.route('/upload', { where: 'server' })
  .get(function () {
    console.log('get upload');
  	var res = this.response;
  	res.end('Hello\n');
  })
  .post(function (data) {
  	files = this.request.files;
    var res = this.response;

    if (Meteor.isserver)
      console.log('test');
      // Insert into the tasks collection
      Meteor.call('tasks.pi_insert', "Pi", function(err, _id) {
        image_id = _id;
        var file = new FS.File();
      
        file.attachData(files[0].data, {type: files[0].mimeType},function(err){
            file.name(files[0].filename);

            Uploads.insert(file, function (err, fileObj) {
               while(fileObj.url()==null);

                var resp = {
                    files: {url: "images-"+image_id+"-"+fileObj.name({store: 'images'})}
                };
                fileObj.name('kitten.jpg', {store: 'images'});
                Meteor.call('tasks.setUrl', image_id, "images/"+fileObj.name({store: 'images'}));
                res.end(JSON.stringify(resp));
            });
        });
      });

  	res.end('Uploading..?\n');
  });