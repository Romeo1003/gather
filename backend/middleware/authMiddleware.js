import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return responseHandler.authError(res, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    
    if (!user) {
      return responseHandler.authError(res, 'Invalid token');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return responseHandler.serverError(res, 'Token verification failed', error);
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  // verifyToken middleware should be called before this
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  
  next();
};

// You can remove this if it's not being used
export const authMiddleware = (req, res, next) => {
  // Middleware logic here
  next();
};