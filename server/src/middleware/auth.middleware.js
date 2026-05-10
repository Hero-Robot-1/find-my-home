import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { userId } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
