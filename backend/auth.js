import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import supabase from './db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
const REFRESH_JWT_EXPIRE = process.env.REFRESH_JWT_EXPIRE;

const createToken = (email, id) => {
    const accessToken = jwt.sign({email, id}, JWT_SECRET, {expiresIn: JWT_EXPIRE});
    const refreshToken = jwt.sign({email, id}, REFRESH_JWT_SECRET, {expiresIn: REFRESH_JWT_EXPIRE});
    return {accessToken, refreshToken};
}

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken) {
        if (!refreshToken)
            return res.status(401).json({error: "No token provided"});
        else {
            try {
                const { data } = await supabase
                    .from('users')
                    .select('id')
                    .eq('refresh_token', refreshToken);
                if (data.length === 0)
                    return res.status(401).json({error: "Invalid token"});
                else {
                    jwt.verify(refreshToken, REFRESH_JWT_SECRET, (err, decoded) => {
                        if (err)
                            return res.status(401).json({error: "Invalid token"});
                        else {
                            const { accessToken } = createToken(decoded.email, decoded.id);
                            res.cookie("accessToken", accessToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                maxAge: 15 * 60 * 1000, // 15 minutes
                                sameSite: "none",
                            });
                            req.email = decoded.email;
                            req.id = decoded.id;
                            next();
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({error: 'Server error!'});
            }
        }
    }
    else {
        jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
            if (err)
                return res.status(401).json({error: "Invalid token"});
            else {
                req.email = decoded.email;
                req.id = decoded.id;
                next();
            }
        });
    }
};

export default verifyJWT;
export { createToken };
