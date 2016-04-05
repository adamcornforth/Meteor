import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
    if (Meteor.isServer) {
        var Busboy = Meteor.npmRequire('busboy')

        Router.onBeforeAction(function (req, res, next) {
            var files = []; // Store files in an array and then pass them to request.
            var image = {}; // crate an image object

            if (req.method === "POST") {
                var busboy = new Busboy({ headers: req.headers });
                busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
                    image.mimeType = mimetype;
                    image.encoding = encoding;
                    image.filename = filename;

                    // buffer the read chunks
                    var buffers = [];

                    file.on('data', function(data) {
                        buffers.push(data);
                    });
                    file.on('end', function() {
                        // concat the chunks
                        image.data = Buffer.concat(buffers);
                        // push the image object to the file array
                        files.push(image);
                    });
                });

                busboy.on("field", function(fieldname, value) {
                    req.body[fieldname] = value;
                });

                busboy.on("finish", function () {
                    // Pass the file array together with the request
                    req.files = files;
                    next();
                });
                // Pass request to busboy
                req.pipe(busboy);
            }
            else{
                this.next();
            }
        });
    }
}); 

Router.route('/', function () {
  this.render('Body');
});