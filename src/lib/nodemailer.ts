/**
 * Node modules
 */
import nodemailer from 'nodemailer';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Create a reusable transporter object using the default SMTP transport.
 * - Configures the transporter with the SMTP host, port, and authentication credentials.
 */
const nodemailerTransport = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  // requireTLS: true,
  // pool: true,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export default nodemailerTransport;
