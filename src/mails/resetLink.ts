/**
 * Types
 */
export type TemplateParams = {
  name?: string;
  resetLink?: string;
  companyName?: string;
  currentYear?: number;
};

export const resetLinkTemplate = ({
  name,
  resetLink,
  companyName = 'Shortly',
  currentYear = new Date().getFullYear(),
}: TemplateParams) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>
    <body>
      <p>Hi ${name || 'there'},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,<br />${companyName} Team</p>
      <footer>
        <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
      </footer>
    </body>
  </html>`;
};
