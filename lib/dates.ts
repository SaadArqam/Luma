/**
 * Canonical date-boundary logic for the app.
 *
 * Every "today" in this codebase — the Today card's range, the streak walk,
 * Quick Add's default date, daily-tip generation, and the notification crons —
 * must agree on when a day starts and ends. Before this module they each used
 * the *UTC* calendar day, so for an IST user (UTC+05:30) anything logged
 * between 00:00 and 05:30 local landed on the previous day.
 *
 * `expenses.date` is TIMESTAMPTZ, so a day must be matched as a half-open
 * instant range [dayStart, nextDayStart) — never `.eq('date', 'YYYY-MM-DD')`,
 * which only matches rows stored at exactly midnight UTC.
 *
 * Implementation note: offsets are read from the IANA database via `Intl`
 * rather than hardcoded as +05:30, so this stays correct for other zones (the
 * crons run per-user timezones) and across DST transitions. India does not
 * observe DST, but the notification crons already support arbitrary zones.
 * If date-fns-tz or Luxon is added later this module is the only thing to swap.
 */

export const APP_TIMEZONE = 'Asia/Kolkata'

/** Offset of `timeZone` from UTC at `instant`, in ms (positive east of UTC). */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const p: Record<string, string> = {}
  for (const { type, value } of dtf.formatToParts(instant)) p[type] = value

  // Some ICU versions render midnight as hour '24'.
  const hour = Number(p.hour) % 24
  const asIfUtc = Date.UTC(
    Number(p.year), Number(p.month) - 1, Number(p.day),
    hour, Number(p.minute), Number(p.second),
  )
  // Compare at whole-second precision so the result is a clean zone offset.
  return asIfUtc - Math.floor(instant.getTime() / 1000) * 1000
}

/** Calendar date ('YYYY-MM-DD') that `instant` falls on in `timeZone`. */
export function zonedDateString(instant: Date = new Date(), timeZone: string = APP_TIMEZONE): string {
  // 'en-CA' formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
}

/** The UTC instant at which calendar date `dateStr` begins in `timeZone`. */
export function zonedDayStart(dateStr: string, timeZone: string = APP_TIMEZONE): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const wallClock = Date.UTC(y, m - 1, d, 0, 0, 0)
  // Correct the naive guess by the zone's offset, then re-check: close to a DST
  // transition the offset at the corrected instant can differ from the guess.
  let ms = wallClock - zoneOffsetMs(new Date(wallClock), timeZone)
  ms = wallClock - zoneOffsetMs(new Date(ms), timeZone)
  return new Date(ms)
}

/** Start of the day containing `instant`, as a UTC instant. */
export function startOfZonedDay(instant: Date = new Date(), timeZone: string = APP_TIMEZONE): Date {
  return zonedDayStart(zonedDateString(instant, timeZone), timeZone)
}

/**
 * Start of the NEXT day — the exclusive upper bound of the day containing
 * `instant`. Pair with `startOfZonedDay` as `.gte(start)` + `.lt(end)`.
 */
export function endOfZonedDayExclusive(instant: Date = new Date(), timeZone: string = APP_TIMEZONE): Date {
  return zonedDayStart(addDays(zonedDateString(instant, timeZone), 1), timeZone)
}

/**
 * Shift a 'YYYY-MM-DD' string by whole days. Pure calendar arithmetic on the
 * date label — deliberately timezone-free, for walking the streak day by day.
 */
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const shifted = new Date(Date.UTC(y, m - 1, d + days))
  return shifted.toISOString().slice(0, 10)
}

/** Half-open [start, end) instant range covering a calendar date in `timeZone`. */
export function zonedDayRange(dateStr: string, timeZone: string = APP_TIMEZONE) {
  return {
    start: zonedDayStart(dateStr, timeZone),
    end: zonedDayStart(addDays(dateStr, 1), timeZone),
  }
}
