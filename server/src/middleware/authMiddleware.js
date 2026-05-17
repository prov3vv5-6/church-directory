const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // The frontend sends the token in the Authorization header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Strip the "Bearer " prefix to get just the token string
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token was signed with our secret and hasn't expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (id, email) to the request so controllers can use it
    req.user = decoded;

    // Pass control to the next function (the controller)
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
