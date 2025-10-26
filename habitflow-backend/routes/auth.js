// habitflow-backend/routes/auth.js
import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Regular auth routes (Email/Password)
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes - DISABLED FOR NOW
// Uncomment these when you add Google OAuth credentials
/*
import passport from 'passport';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false 
  }),
  (req, res) => {
    import('../middleware/auth.js').then(module => {
      const token = module.generateToken(req.user._id);
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    });
  }
);
*/

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;