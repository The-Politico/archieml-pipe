import http from 'http';
import inquirer from 'inquirer';
import open from 'open';
import url from 'url';
import winston from './logging';
import storeToken from './store-token';
import exportGDoc from './export-gdoc';


const getNewToken = (auth, archie) => {
  const oauth = auth;
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
    approval_prompt: 'force',
  });

  const hostname = 'localhost';
  const port = 6006;
  const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // Note the extra "#" is important below. Gets stripped in queryObject.
    res.end(`
      <h1
        style="padding:10px 20px;
              display: inline-block;
              margin: 20px auto;
              text-align: left;
              background:#eee;
              color:#3b5998;
              font-family:monospace;"
      >
      ${queryObject.code}#
      </h1>
    `);
  });

  server.listen(port, hostname);

  console.log('Authorize this app by visiting this url: ', authUrl);
  open(authUrl);
  const questions = [
    {
      name: 'code',
      message: 'Enter the code you receive from Google here:',
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const code = answers.code;
    server.close();
    oauth.getToken(code, (err, token) => {
      if (err) {
        winston.log('error', `Error while trying to retrieve access token: ${err}`);
        return;
      }
      oauth.credentials = token;
      storeToken(token);
      exportGDoc(oauth, archie);
    });
  });
};

export default getNewToken;
