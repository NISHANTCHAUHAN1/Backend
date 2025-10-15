import jwt from 'jsonwebtoken';

const generateToken = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SEC, {
        expiresIn: "15d",
    });

    // For cross-site requests (frontend on different origin) browsers require
    // SameSite=None and Secure. Use these settings in production. In development
    // when running on http://localhost we can use SameSite: 'lax' and not Secure.
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProd, // only send cookie over HTTPS in production
        sameSite: isProd ? 'none' : 'lax'
    });
};

export default generateToken;