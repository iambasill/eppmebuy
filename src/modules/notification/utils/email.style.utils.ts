export function createPlainTextEmail(name: string, token: string, appName: string): string {
    return `Hello ${name},

Thank you for registering with ${appName}. To complete your account setup, please verify your email address using the token below.

Verification Token: ${token}

This token will expire in 24 hours.

If you did not create this account, please ignore this email.

Best regards,
The ${appName} Team`;
}

export function createHtmlEmail(name: string, token: string, appName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px 0;
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #6366f1; 
            margin: 0;
        }
        .content { 
            background-color: #ffffff; 
            padding: 40px; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .token-box { 
            background-color: #f0f4ff; 
            padding: 20px; 
            border-left: 4px solid #6366f1; 
            margin: 25px 0; 
            font-family: 'Courier New', monospace; 
            font-size: 16px; 
            font-weight: bold;
            text-align: center;
            letter-spacing: 2px;
            border-radius: 4px;
            color: #1e40af;
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px;
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #e5e5e5;
        }
        .expires { 
            color: #dc2626; 
            font-size: 14px; 
            margin-top: 15px;
            font-weight: 500;
        }
        .btn {
            display: inline-block;
            background-color: #6366f1;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: 600;
        }
        h2 {
            color: #1f2937;
            margin-top: 0;
        }
        p {
            margin-bottom: 15px;
            color: #4b5563;
        }
        @media (max-width: 600px) {
            .content {
                padding: 25px;
            }
            .token-box {
                font-size: 14px;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${appName}</div>
        </div>
        <div class="content">
            <h2>Welcome to ${appName}, ${name}!</h2>
            <p>Thank you for registering with ${appName}. To complete your account setup and unlock all features, please verify your email address.</p>
            
            <p><strong>Your Verification Token:</strong></p>
            <div class="token-box">${token}</div>
            
            <p>Enter this token in the verification form to activate your account.</p>
            
            <div class="expires">
                ⏱️ <strong>Token Expires: 24 hours from now</strong>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                If you did not create this account, please disregard this email or contact our support team.
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>`;
}

export function createForgotTextEmail(
    name: string,
    token: string,
    appName: string,
    supportEmail: string
): string {
    return `Hello ${name},

We received a request to reset your ${appName} password. 

Your Password Reset Token: ${token}

This token will expire in 24 hours.

To reset your password:
1. Go to the password reset page
2. Enter this token along with your new password

If you did not request a password reset, please:
- Ignore this email
- Consider changing your password as a security precaution
- Contact our support team at ${supportEmail} if you have concerns

For security reasons:
- Never share this token with anyone
- Our team will never ask for this token
- This token is valid for one-time use only

Best regards,
The ${appName} Security Team`;
}

export function createForgotHtmlEmail(
    name: string,
    token: string,
    appName: string,
    supportEmail: string
): string {
    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Reset Your Password - ${appName}</title>
    <style>
        /* Base Styles */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Container */
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        /* Header */
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            letter-spacing: -0.5px;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 8px;
            font-weight: 400;
        }
        
        /* Content */
        .content { 
            padding: 40px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #6b7280;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        /* Token Box */
        .token-section {
            background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #c7d2fe;
            text-align: center;
        }
        .token-label {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #4f46e5;
            margin-bottom: 12px;
        }
        .token-box { 
            background-color: #ffffff; 
            padding: 20px; 
            border-radius: 8px; 
            font-family: 'SF Mono', Monaco, 'Courier New', monospace; 
            font-size: 20px; 
            font-weight: 700;
            letter-spacing: 2px;
            color: #1e40af;
            border: 2px dashed #818cf8;
            margin: 10px 0;
            word-break: break-all;
            text-align: center;
        }
        
        /* Instructions */
        .instructions {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .instructions-title {
            font-weight: 700;
            color: #92400e;
            margin-bottom: 10px;
        }
        .instructions ol {
            margin: 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
            color: #78350f;
        }
        
        /* Security Notice */
        .security-notice {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .security-title {
            color: #991b1b;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .security-icon {
            font-size: 18px;
        }
        
        /* Expiry */
        .expiry-notice {
            background-color: #dbeafe;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .expiry-text {
            color: #1e40af;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 15px;
        }
        
        /* Footer */
        .footer { 
            background-color: #f3f4f6;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .support-link {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 600;
        }
        .support-link:hover {
            text-decoration: underline;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 25px;
            }
            .token-box {
                font-size: 18px;
                padding: 15px;
            }
            .header {
                padding: 30px 15px;
            }
            .logo {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">${appName}</h1>
            <div class="tagline">Secure Account Management</div>
        </div>
        
        <div class="content">
            <h2 class="greeting">Hello ${name},</h2>
            <p class="subtitle">We received a request to reset your ${appName} password.</p>
            
            <div class="token-section">
                <div class="token-label">Your Password Reset Token</div>
                <div class="token-box">${token}</div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                    Use this token to reset your password
                </p>
            </div>
            
            <div class="instructions">
                <div class="instructions-title">How to reset your password:</div>
                <ol>
                    <li>Go to the password reset page</li>
                    <li>Enter your email address</li>
                    <li>Enter the token above</li>
                    <li>Create a new strong password</li>
                    <li>Confirm your new password</li>
                </ol>
            </div>
            
            <div class="expiry-notice">
                <div class="expiry-text">
                    <span>⏱️</span>
                    <span>This token expires in <strong>24 hours</strong></span>
                </div>
            </div>
            
            <div class="security-notice">
                <div class="security-title">
                    <span class="security-icon">🔒</span>
                    <span>Security Notice</span>
                </div>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">
                    <strong>Important:</strong> If you didn't request this password reset, please ignore this email. 
                    For security concerns, contact our support team immediately.
                </p>
            </div>
            
            <p style="color: #6b7280; font-size: 15px; margin-top: 30px;">
                For security reasons, please note:
                <br>• Never share this token with anyone
                <br>• Our team will never ask for this token
                <br>• This token is valid for one-time use only
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Need help? Contact our support team at 
                <a href="mailto:${supportEmail}" class="support-link">${supportEmail}</a>
            </p>
            <p class="footer-text">
                &copy; ${currentYear} ${appName}. All rights reserved.
                <br>This is an automated message, please do not reply.
            </p>
            <p class="footer-text" style="font-size: 12px; color: #9ca3af;">
                If you're having trouble clicking, copy and paste this token manually.
            </p>
        </div>
    </div>
</body>
</html>`;
}
