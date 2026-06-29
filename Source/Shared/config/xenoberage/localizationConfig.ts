/**
 * Localization Configuration
 * ============================================================================
 * Ported from Xenobe Rage PHP config.php — regional display settings.
 * ============================================================================
 */

export interface LocalizationConfig {
  /** Decimal point character — $local_number_dec_point */
  readonly NUMBER_DECIMAL_POINT: '.';
  /** Thousands separator — $local_number_thousands_sep */
  readonly NUMBER_THOUSANDS_SEP: ',';
  /** Default language — $default_lang */
  readonly DEFAULT_LANGUAGE: 'english';
  /** Footer display style — $footer_style */
  readonly FOOTER_STYLE: 'old';
}

export const LOCALIZATION = {
  NUMBER_DECIMAL_POINT: '.',
  NUMBER_THOUSANDS_SEP: ',',
  DEFAULT_LANGUAGE: 'english',
  FOOTER_STYLE: 'old',
} as const satisfies LocalizationConfig;
