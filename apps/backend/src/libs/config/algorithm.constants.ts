const WINDOW_DAYS = 6;
const BEFORE_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET = 0;
const AFTER_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET = 1;

/**
 * Algorithm configuration constants for the validation engine.
 * Centralizes all algorithm-related configuration to avoid magic numbers
 * and facilitate adjustments to business rules.
 */
export const algorithmConfig = {
  /**
   * The hour (in Paris timezone) at which the validation engine runs daily.
   * Determines when the window shifts (before 20h: J+0 to J+5, after 20h: J+1 to J+6)
   */
  newDateOpeningHourParis: 20,

  /**
   * The duration of the attribution window in days.
   * Reservations enter the window when they are 6 days away from their starting date.
   */
  windowDays: WINDOW_DAYS,

  /**
   * Day offsets for the attribution window before 20h Paris time.
   * Process reservations from today (J+0) to 5 days ahead (J+5)
   */
  beforeNewDateOpeningHour: {
    startDayOffset: BEFORE_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET,
    endDayOffset: BEFORE_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET + WINDOW_DAYS - 1,
  },

  /**
   * Day offsets for the attribution window after 20h Paris time.
   * Process reservations from tomorrow (J+1) to 6 days ahead (J+6)
   */
  afterNewDateOpeningHour: {
    startDayOffset: AFTER_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET,
    endDayOffset: AFTER_NEW_DATE_OPENING_HOUR_START_DAY_OFFSET + WINDOW_DAYS - 1,
  },
} as const;
