import { timingSafeEqual } from "node:crypto";

export default function requireAdminToken(req, res, next) {
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    return res.status(503).json({
      success: false,
      message: "Admin access is not configured on the API server.",
    });
  }

  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer (.+)$/i);
  const providedToken = match?.[1] || "";
  const provided = Buffer.from(providedToken);
  const expected = Buffer.from(adminToken);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return res.status(401).json({
      success: false,
      message: "Valid admin access is required for this action.",
    });
  }

  return next();
}
