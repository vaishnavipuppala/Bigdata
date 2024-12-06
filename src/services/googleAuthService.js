import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class GoogleAuthService {
  constructor() {
    // Initialize OAuth2 client with your credentials
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Load RSA keys
    this.privateKey = readFileSync(join(__dirname, '../../private_key.pem'));
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });
  }

  async getGoogleUser(code) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials({ access_token: tokens.access_token });

      // Get user profile information
      const { data } = await this.oauth2Client.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });

      return data;
    } catch (error) {
      console.error('Error getting Google user:', error);
      throw error;
    }
  }

  generateToken(userData) {
    return jwt.sign(
      {
        sub: userData.id,
        email: userData.email,
        name: userData.name
      },
      this.privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '1h'
      }
    );
  }
}

export default new GoogleAuthService();