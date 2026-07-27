/**
 * Bank → domain mapping, used to look up logos via logo.dev.
 *
 * The domain is the whole point: logo.dev resolves a brand logo from a company
 * domain, so `bank_domain` is what gets stored on the account, not the display
 * name. Banks not in this list can still get a logo by entering a domain by
 * hand; `Cash` and `Other` deliberately have none and fall back to an
 * initial-letter avatar.
 */
export type Bank = { name: string; domain: string | null }

export const BANKS: Bank[] = [
  { name: 'State Bank of India', domain: 'sbi.co.in' },
  { name: 'HDFC Bank',           domain: 'hdfcbank.com' },
  { name: 'ICICI Bank',          domain: 'icicibank.com' },
  { name: 'Axis Bank',           domain: 'axisbank.com' },
  { name: 'Kotak Mahindra Bank', domain: 'kotak.com' },
  { name: 'Punjab National Bank',domain: 'pnbindia.in' },
  { name: 'Bank of Baroda',      domain: 'bankofbaroda.in' },
  { name: 'Yes Bank',            domain: 'yesbank.in' },
  { name: 'IDFC First Bank',     domain: 'idfcfirstbank.com' },
  { name: 'Canara Bank',         domain: 'canarabank.com' },
  { name: 'Union Bank of India', domain: 'unionbankofindia.co.in' },
  { name: 'IndusInd Bank',       domain: 'indusind.com' },
  { name: 'Cash',                domain: null },
  { name: 'Other',               domain: null },
]

export const ACCOUNT_TYPES = ['savings', 'current', 'cash', 'other'] as const
export type AccountType = (typeof ACCOUNT_TYPES)[number]

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  savings: 'Savings',
  current: 'Current',
  cash: 'Cash',
  other: 'Other',
}

/**
 * logo.dev URL for a domain, or null when there is no domain or no token
 * configured — in which case callers show the initial-letter avatar instead.
 * Requested at 2× the rendered size so it stays crisp on phone screens.
 */
export function bankLogoUrl(domain: string | null | undefined, size = 80): string | null {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN
  if (!domain || !token) return null
  return `https://img.logo.dev/${encodeURIComponent(domain)}?token=${token}&size=${size}&format=png`
}
