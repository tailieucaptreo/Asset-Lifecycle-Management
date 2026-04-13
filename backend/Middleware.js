exports.auth = (req, res, next) => {
  const role = req.headers.role;

  if (!role) return res.status(401).json({ error: "No role" });

  req.role = role;
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  next();
};