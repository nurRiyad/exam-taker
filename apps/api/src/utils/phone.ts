// Bangladesh mobile numbers: local `01[3-9]XXXXXXXX` (11 digits) is what
// users type/see; `+880XXXXXXXXXX` is what's stored.
import { BD_LOCAL_PHONE_REGEX } from "@exam-taker/validation/phone";
export { BD_LOCAL_PHONE_REGEX };

export function normalizePhoneToE164(local: string): string {
  return `+880${local.slice(1)}`;
}

export function denormalizePhoneToLocal(e164: string): string {
  return `0${e164.slice(4)}`;
}
