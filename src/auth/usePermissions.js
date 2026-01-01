import { useMemo } from "react";
import { useMsal } from "@azure/msal-react";
import {
  hasClaim as hasClaimRaw,
  hasAnyClaim as hasAnyClaimRaw,
} from "./permissions";

// Hook: provides permission-checking utilities for the currently signed-in account
export default function usePermissions() {
  const { accounts } = useMsal();
  const account = accounts && accounts.length > 0 ? accounts[0] : null;

  const api = useMemo(() => {
    return {
      hasClaim: (claimName) => hasClaimRaw(account, claimName),
      hasAnyClaim: (claimNames) => hasAnyClaimRaw(account, claimNames),
      account,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return api;
}

export { hasClaimRaw as hasClaim, hasAnyClaimRaw as hasAnyClaim };
