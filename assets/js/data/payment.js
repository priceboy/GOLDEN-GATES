/**
 * Payment configuration.
 *
 * IMPORTANT: The previous site hard-coded account numbers, recipient names and
 * Cash App / Venmo handles that were never confirmed as current and authorised
 * by the foundation. `verified` is therefore false, which makes the donation
 * dialog show a "details awaiting confirmation" notice instead of publishing
 * financial details.
 *
 * To enable published payment instructions:
 *   1. Have an authorised foundation representative confirm every value below.
 *   2. Fill in the details and set `verified: true`.
 *   3. Re-test each method in the donation dialog before deploying.
 */
export const PAYMENT = {
  verified: false,
  whatsapp: "237652796507",
  cashapp: {
    label: "Cash App",
    handle: "", // e.g. "GoldenGateSupport" (without the $)
  },
  venmo: {
    label: "Venmo",
    handle: "", // Venmo username
  },
  bank: {
    label: "Bank deposit",
    accountName: "",
    accountNumber: "",
    bankName: "",
  },
  mtn: {
    label: "MTN Mobile Money",
    accountName: "",
    accountNumber: "",
  },
  orange: {
    label: "Orange Money",
    accountName: "",
    accountNumber: "",
  },
};
