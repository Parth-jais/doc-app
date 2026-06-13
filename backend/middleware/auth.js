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

    if (decoded.role !== "user") {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }

    req.userId = decoded.userId;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token"
    });

  }
};


const doctorAuth = async (req, res, next) => {
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

    if (decoded.role !== "doctor") {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }

    req.doctorId = decoded.doctorId;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token"
    });

  }
};


const adminAuth = async (req, res, next) => {

    try {

        const token = req.headers.token;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        next();

    } catch (error) {

        res.json({
            success: false,
            message: "Invalid Token"
        });

    }

};

module.exports = {authUser, doctorAuth, adminAuth};