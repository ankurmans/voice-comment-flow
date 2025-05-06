
import { corsHeaders } from "./utils.ts";

// Handle privacy policy requests
export function handlePrivacyPolicy() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            }
            h1, h2 {
                color: #444;
            }
            h1 {
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            section {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Privacy Policy</h1>
        <section>
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
            <p>This Privacy Policy describes how we collect, use, and handle your information when you use our application.</p>
        </section>
        
        <section>
            <h2>Information We Collect</h2>
            <p>When you connect your Instagram account, we collect basic profile information such as your username and profile picture. We use this information to provide our service and improve your experience.</p>
        </section>
        
        <section>
            <h2>How We Use Your Information</h2>
            <ul>
                <li>To provide, maintain, and improve our services</li>
                <li>To personalize your experience</li>
                <li>To communicate with you about our services</li>
            </ul>
        </section>
        
        <section>
            <h2>Data Storage and Security</h2>
            <p>We implement appropriate security measures to protect your personal information. Your data is stored securely and we take steps to ensure it is not accessed by unauthorized individuals.</p>
        </section>
        
        <section>
            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. You can disconnect your Instagram account from our application whenever you wish.</p>
        </section>
        
        <section>
            <h2>Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </section>
        
        <section>
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </section>
    </body>
    </html>`,
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html"
      }
    }
  );
}
