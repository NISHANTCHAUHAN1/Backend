import jwt from 'jsonwebtoken';

const generateToken = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SEC, {
        expiresIn: "15d",
    });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProd, 
        sameSite: isProd ? 'none' : 'lax'
    });
};

export default generateToken;