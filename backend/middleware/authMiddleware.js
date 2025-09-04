import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // This check now correctly handles the case where authHeader is undefined.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // We now correctly send a 401 Unauthorized error instead of crashing.
        return res.status(401).json({ message: 'No valid token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        // This will catch invalid/expired tokens.
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;