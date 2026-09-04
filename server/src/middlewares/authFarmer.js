const authFarmer = async (req, res, next) => {
    if (req.userRole !== 'FARMER' && req.userRole !== 'ADMIN') {
        return res.json({ 
            success: false, 
            message: "Access denied. Only registered Farmers or Admins can perform this action." 
        });
    }
    next();
};

export default authFarmer;