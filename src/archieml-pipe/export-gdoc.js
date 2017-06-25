import google from 'googleapis';
import chalk from 'chalk';
import htmlparser from 'htmlparser2';
import parseGDoc from './parse-gdoc';
import winston from './logging';


const exportDoc = (auth, opts) => {
  const drive = google.drive({
    version: 'v2',
    auth,
  });
  drive.files.get({ fileId: opts.googleDocId }, (er, doc) => {
    if (er) {
      winston.error(chalk.bgRed('Error accessing gdoc:'), er);
      return;
    }
    const exportLink = doc.exportLinks['text/html'];
    auth._makeRequest({ // eslint-disable-line no-underscore-dangle
      method: 'GET',
      uri: exportLink,
    }, (err, body) => {
      if (err) {
        winston.error(chalk.bgRed('Error downloading googledoc:'), err);
        return;
      }
      const handler = new htmlparser.DomHandler((error, dom) => {
        if (error) {
          winston.error(chalk.bgRed('Error parsing googledoc:'), error);
          return;
        }
        parseGDoc(dom, opts);
      });
      const parser = new htmlparser.Parser(handler);
      parser.write(body);
      parser.done();
    });
  });
};

export default exportDoc;
