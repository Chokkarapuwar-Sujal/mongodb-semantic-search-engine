function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found" });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.response?.status || err.statusCode || 500;
  const message = err.response?.data?.detail || err.message || "Unexpected server error";

  if (statusCode >= 500) {
    console.error("[ERROR]", err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };
