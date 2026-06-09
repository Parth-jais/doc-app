const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {

    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token"
    });

  }
};

module.exports = authUser;