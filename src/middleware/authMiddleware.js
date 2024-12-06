import axios from 'axios';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the token with the OAuth 2.0 provider
      const response = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
        params: { access_token: token }
      });

      const userData = response.data;
      req.user = userData;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};