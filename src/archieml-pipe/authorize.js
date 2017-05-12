import GoogleAuth from 'google-auth-library';
import fs from 'fs-extra';
import path from 'path';
import getNewToken from './get-new-token';
import exportGDoc from './export-gdoc';


const TOKEN_PATH = path.resolve(process.cwd(), 'archie-token.json');

const authorize = (archie) => {
  const clientSecret = archie.clientSecret;
  const clientId = archie.clientId;
  const redirectUrl = archie.redirectUrl;
  const auth = new GoogleAuth();
  const oauth = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth, archie);
    } else {
      oauth.credentials = JSON.parse(token);
      exportGDoc(oauth, archie);
    }
  });
};

export default authorize;
