import winston from 'winston';

winston.level = process.env.LOG_LEVEL || 'error';

export default winston;
