# Meteor Todo App

Todo app with task ownership and file uploading to Amazon S3. 

Adapted from the Meteor [getting started tutorial](https://www.meteor.com/tutorials/blaze/creating-an-app).

![Demo](http://i.imgur.com/ncIWP74.gif)

## Running the App

To run the app, use:

```
meteor npm install
meteor
```

And then open your web browser at `http://localhost:3000`.

### Installing Meteor

To install the latest official Meteor release from your terminal: 

```
curl https://install.meteor.com/ | sh
```

## Deploying with Heroku

Firstly you'll need to install the [Heroku toolbelt](https://toolbelt.heroku.com/) and [sign up to Heroku](https://www.heroku.com). 

Then create an app on Heroku with any name, e.g. `your-app-name`.

While in the project repository root, notify heroku of your new app using:

```
heroku git:remote -a your-app-name
```

### Setup the Heroku App

Let Heroku know that the application you're deploying is a Meteor app using the [Meteor Heroku Buildpack](https://devcenter.heroku.com/articles/buildpacks). 

```
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git
```

You will also need to add the MongoLab Addon to the application:

```
heroku addons:create mongolab
```

Lastly, set the project `ROOT_URL`, setting `your-app-name` to be the same as your chosen app name.

```
heroku config:set ROOT_URL=https://your-app-name.herokuapp.com
```

### Deploying

You can then simply deploy by pushing to the `heroku` remote.

```
git push heroku master
```

## File upload to Amazon S3 

To enable file upload to Amazon S3, you will need to create a dotenv file (`.env`) with the following configuration:

```
S3_KEY=<your-s3-key>
S3_SECRET_KEY=<your-s3-secret>
S3_BUCKET=<your-s3-bucket>
S3_REGION=<your-s3-region>
```

You can get your S3 key and secret key from your `(Your Name) -> Security Credentials -> Access Keys` in Amazon AWS. 