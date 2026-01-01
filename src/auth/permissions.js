// Centralized permission helpers for MSAL account claims
// Provides small utilities to check for roles/scopes/permissions on an idTokenClaims object.

export function hasClaim(account, claimName) {
  if (!account || !account.idTokenClaims) return false;
  const claims = account.idTokenClaims;

  // Check common claim containers
  if (Array.isArray(claims.roles) && claims.roles.includes(claimName))
    return true;
  if (
    Array.isArray(claims.permissions) &&
    claims.permissions.includes(claimName)
  )
    return true;

  // scope/scp often contains space-separated scopes
  if (
    typeof claims.scope === "string" &&
    claims.scope.split(" ").includes(claimName)
  )
    return true;
  if (
    typeof claims.scp === "string" &&
    claims.scp.split(" ").includes(claimName)
  )
    return true;

  // boolean or string claim with exact name
  if (claims[claimName]) return true;

  return false;
}

export function hasAnyClaim(account, claimNames = []) {
  if (!Array.isArray(claimNames) || claimNames.length === 0) return false;
  return claimNames.some((c) => hasClaim(account, c));
}

export default { hasClaim, hasAnyClaim };
