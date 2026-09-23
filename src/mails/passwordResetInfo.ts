/**
 * Types
 */
export type TemplateParams = {
  name?: string;
  supportLink?: string;
  companyName?: string;
  currentYear?: number;
};

export const passwordResetTemplate = ({
  name,
  supportLink,
  companyName = 'Shortly',
  currentYear = new Date().getFullYear(),
}: TemplateParams) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset Information</title>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset Information</h1>
        <p>Hello ${name || 'User'}, </p>
        <p>
          We received a request to reset your password. If you did not make this request, please ignore this email.
        </p>
        <p>
          If you need assistance, please contact our support team at
          <a href="${supportLink || '#'}">${supportLink || 'Support'}</a>.
        </p>
      </div>
      <hr />
      <p style="text-align: center; color: #888888;">
        This is an automated message. Please do not reply to this email.
      </p>
      <hr />
      <footer style="text-align: center; color: #888888; font-size: 12px;">
        <p>&copy; ${currentYear} ${companyName}. All rights reserved.</p>
      </footer>
    </body>
  </html>`;
};
