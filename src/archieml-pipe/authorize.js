import GoogleAuth from 'google-auth-library';
import fs from 'fs-extra';
import getNewToken from './get-new-token';
import exportGDoc from './export-gdoc';

const authorize = (opts) => {
  const auth = new GoogleAuth();
  const oauth = new auth.OAuth2(
    opts.googleClientId,
    opts.googleClientSecret,
    `http://localhost:${opts.redirectPort}`,
  );

  // Check if we have previously stored a token.
  fs.readFile(opts.tokenPath, (err, token) => {
    if (err) {
      getNewToken(oauth, opts);
    } else {
      oauth.credentials = JSON.parse(token);
      exportGDoc(oauth, opts);
    }
  });
};

export default authorize;
