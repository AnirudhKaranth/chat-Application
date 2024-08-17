import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({msg:"Authentication Invalid"});
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.User = { userId: payload.userId, userName: payload.userName};
        
        next();
    } catch (error) {
        next(error);
    }
};

export default userAuth;