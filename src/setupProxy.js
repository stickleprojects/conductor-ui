const { createProxyMiddleware } = require("http-proxy-middleware");
const target = process.env.WF_SERVER || "http://localhost:8080";

module.exports = function (app) {
  // If enabled via environment, provide a simple fake protected endpoint
  // Useful for local testing without a backend. Enable by setting
  // REACT_APP_USE_FAKE_API=true in your `.env`.
  if (process.env.REACT_APP_USE_FAKE_API === "true") {
    app.get("/api/protected", (req, res) => {
      res.json({
        message: "This is a fake protected resource (development only).",
      });
    });
  }

  app.use(
    "/api",
    createProxyMiddleware({
      target: target,
      //pathRewrite: { "^/api/": "/" },
      changeOrigin: true,
    })
  );
};
