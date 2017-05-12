![Politico](logo.png)

# archieml-pipe [![npm version](https://badge.fury.io/js/archieml-pipe.svg)](https://badge.fury.io/js/archieml-pipe)

archieml-pipe is a library to help easily export data structured in [ArchieML](http://archieml.org/) in Google Docs to local JSON. You can then use that data as context to render HTML templates.

We use this library in order to separate the function of writing and editing text from producing interactive content for the web in the POLITICO newsroom.

Read all about how to use [ArchieML](http://archieml.org/#demo), then see how you can use this library to easily authenticate and export structured data from Google Docs.

### Usage

Use archieml-pipe in your build system:

```javascript
const gulp = require('gulp');
const archiePipe = require('archieml-pipe').default;

gulp.task('archie', () => {
    archiePipe('path/to/export/data.json');
});
```

This example uses [Gulp](http://gulpjs.com/), but of course you can use whatever you like. Just call the function, passing it a string which will represent the path to your export file.

### Credentials

archieml-pipe will prompt you for credentials to connect to your Google Doc if they haven't alreay been supplied in a `archie.json` file at the root of your directory. Here's how to get them:

##### What's you Google doc ID?

Simply open you doc in the browser and copy the ID from the URL:

![GoogleDoc](docId.png)

**Don't forget** to change your share settings to **"Anyone with the link can view."**

##### What's your Google app client ID?

![Oauth](dev-console.png)

1. Go to the [Google Developers Console](https://console.developers.google.com) and create a new project.

2. Create credentials for an OAuth client ID.

3. Select "Web Application" for the Application Type, and give your client a name.

4. Add `http://localhost` to Authorized JavaScript origins

5. Add `http://localhost:6006` to Authorized Redirect URIs

6. Click create and copy both the client ID and client secret.

7. Go to the Library tab in the left rail and search for the **Drive API**

8. Click it and enable the API in the next screen.

##### What's your Google app client secret key?

Use the client secret key you copied out of the previous step.

### archie.json
You can shortcut several prompts by creating an `archie.json` file in the root of your project ahead of time. (For example, we use [Yeoman](http://yeoman.io/) to create that file and remember credentials across builds.)

The file needs the following:

```javascript
{
    "docId": "<Google Doc ID>",
    "clientId": "<Google wep app client ID>",
    "clientSecret": "<Google wep app client secret>",
    "redirectUrl": "http://localhost:6006"
}
```

**Do not** change the `redirectUrl`.

### .gitignore

This library saves authentication details in local files at the root of your project so you don't have to re-enter them. Therefore, it's also a **really good idea** to add those files to your `.gitignore`:

```
# archieml-pipe
archie.json
archie-token.json
```

### Credits

archieml-pipe is cobbled together from several other great ArchieML libs, namely:
+ [node-archieml-boilerplate](https://github.com/stuartathompson/node-archieml-boilerplate)
+ [aml-gdoc-server](https://github.com/Quartz/aml-gdoc-server)
+ [archieml-js](https://github.com/newsdev/archieml-js/blob/master/examples/google_drive.js)

### Developing

Make changes in `src/` and then run `$ gulp` to transpile ES6 code.
