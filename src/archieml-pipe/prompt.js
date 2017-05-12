import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import authorize from './authorize';

const prompt = (exportPath) => {
  const questions = [
    {
      name: 'docId',
      message: 'What\'s your Google doc ID?',
    },
    {
      name: 'clientId',
      message: 'What\'s your Google app client ID?',
    },
    {
      name: 'secretKey',
      message: 'What\'s your Google app client secret key?',
    },
  ];

  const archieConfig = path.resolve(process.cwd(), 'archie.json');
  let archie;

  if (!fs.existsSync(archieConfig)) {
    inquirer.prompt(questions).then((answers) => {
      fs.writeJsonSync(archieConfig, {
        docId: answers.docId,
        clientId: answers.clientId,
        clientSecret: answers.secretKey,
        redirectUrl: 'http://localhost:6006',
      });
      archie = fs.readJsonSync(archieConfig);
      archie.exportPath = exportPath;
      authorize(archie);
    });
  } else {
    archie = fs.readJsonSync(archieConfig);
    archie.exportPath = exportPath;
    authorize(archie);
  }
};

export default prompt;
