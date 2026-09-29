module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (req.accepts('html') && !req.originalUrl.startsWith('/api/')) {
    return res.status(statusCode).send(`<h1>${statusCode}</h1><p>${escapeHtml(error.message)}</p>`);
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
