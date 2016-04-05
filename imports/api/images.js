import { Meteor } from 'meteor/meteor';

FS.File.prototype.S3Url = function(storeName) {
  var self = this;
  var store = self.getCollection().storesLookup[storeName];
  var urlHost = 'http://s3-eu-west-1.amazonaws.com/';
  var urlPath = [imageStore.bucket, this.copies[storeName].key].join('/');
  return urlHost + urlPath;
}

const set = (	   typeof process.env.S3_KEY !== 'undefined' 
	&& typeof process.env.S3_SECRET_KEY !== 'undefined' 
	&& typeof process.env.S3_BUCKET !== 'undefined' );

imageStore = new FS.Store.S3("images", {
  region: process.env.S3_REGION, 
  accessKeyId: process.env.S3_KEY, 
  secretAccessKey: process.env.S3_SECRET_KEY, 
  bucket: process.env.S3_BUCKET,
  folder: ''
});

export const Uploads = new FS.Collection("images", {
  stores: [imageStore]
});

if(set) {
	S3.config = {
	    key: process.env.S3_KEY,
	    secret: process.env.S3_SECRET_KEY,
	    bucket: process.env.S3_BUCKET,
	    region: process.env.S3_REGION, // Only needed if not "us-east-1" or "us-standard"
	};
}

Meteor.methods({
	'images.s3_set'() {
		return (set)
	}
});  
