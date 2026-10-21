import type { ProfileInput } from "@exam-taker/validation";
import type { PublicUser } from "../../utils/user";

/** Demo profile defaults used until profile persistence is approved. */
export function getProfile(user: PublicUser): ProfileInput {
  return {
    fullName: user.name ?? user.username,
    phone: user.phone,
    division: "ঢাকা",
    district: "ঢাকা",
    address: "",
  };
}

/** Echoes validated demo data; no profile data is persisted in this phase. */
export function updateProfile(input: ProfileInput): ProfileInput {
  return input;
}
