import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import querystring from 'querystring';

const router = express.Router();

// OAuth configuration
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// Google login endpoint
router.get('/google/login', (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
    console.log('Generated auth URL:', authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Callback endpoint
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    console.log('Received code:', code);

    if (!code) {
      console.error('Authorization code not received');
      throw new Error('Authorization code not received');
    }

    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Received access token:', tokens.access_token);

    console.log('Fetching user information...');
    const userInfoResponse = await axios.get(GOOGLE_USER_INFO_URL, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = userInfoResponse.data;
    console.log('User info received:', {
      email: userData.email
    });

    // Store the necessary user information in the session or a temporary storage
    req.session.user = {
      id: userData.id,
      email: userData.email,
      name: userData.name
    };

    res.redirect('/plans');
  } catch (error) {
    console.error('Auth error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    res.status(500).send(`
      <html>
        <head>
          <title>Authentication Failed</title>
          <style>
            // ... (existing styles)
          </style>
        </head>
        <body>
          <h2 class="error">❌ Authentication Failed</h2>
          <p>Error: ${error.message}</p>
          <div class="details">
            <pre>${JSON.stringify({
              error: error.response?.data || error.message,
              config: {
                clientId: GOOGLE_CLIENT_ID ? 'present' : 'missing',
                clientSecret: GOOGLE_CLIENT_SECRET ? 'present' : 'missing',
                redirectUri: GOOGLE_REDIRECT_URI
              }
            }, null, 2)}</pre>
          </div>
        </body>
      </html>
    `);
  }
});

export default router;