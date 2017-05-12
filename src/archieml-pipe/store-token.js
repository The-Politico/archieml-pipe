import fs from 'fs-extra';
import path from 'path';

const TOKEN_PATH = path.resolve(process.cwd(), 'archie-token.json');

const storeToken = (token) => {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
};

export default storeToken;
