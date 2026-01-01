import { renderHook } from "@testing-library/react-hooks";
import usePermissions, {
  hasClaim as hasClaimRaw,
  hasAnyClaim as hasAnyClaimRaw,
} from "../usePermissions";
import { useMsal } from "@azure/msal-react";

jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn(),
}));

describe("usePermissions", () => {
  beforeEach(() => {
    useMsal.mockReset();
  });

  test("returns null account and false checks when no accounts", () => {
    useMsal.mockReturnValue({ accounts: [] });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.account).toBeNull();
    expect(result.current.hasClaim("anything")).toBe(false);
    expect(result.current.hasAnyClaim(["a", "b"])).toBe(false);
  });

  test("hasClaim and hasAnyClaim work with various claim shapes", () => {
    const account = {
      idTokenClaims: {
        roles: ["admin"],
        permissions: ["read"],
        scope: "scope1 scope2",
        scp: "scp1 scp2",
        customFlag: true,
        strClaim: "present",
      },
    };
    useMsal.mockReturnValue({ accounts: [account] });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.account).toBe(account);
    expect(result.current.hasClaim("admin")).toBe(true);
    expect(result.current.hasClaim("read")).toBe(true);
    expect(result.current.hasClaim("scope2")).toBe(true);
    expect(result.current.hasClaim("scp1")).toBe(true);
    expect(result.current.hasClaim("customFlag")).toBe(true);
    expect(result.current.hasClaim("strClaim")).toBe(true);
    expect(result.current.hasClaim("missing")).toBe(false);

    expect(result.current.hasAnyClaim(["missing", "admin"])).toBe(true);
    expect(result.current.hasAnyClaim(["nope", "stillNope"])).toBe(false);
  });

  test("exported raw helpers behave the same", () => {
    const account = { idTokenClaims: { roles: ["role1"] } };
    expect(hasClaimRaw(account, "role1")).toBe(true);
    expect(hasAnyClaimRaw(account, ["role1", "role2"])).toBe(true);
  });
});
