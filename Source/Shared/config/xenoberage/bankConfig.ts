export const BANK_CONFIG = {
  interest: 0.00015,
  paymentFee: 0.05,
  loanInterest: 0.0010,
  loanFactor: 0.10,
  loanLimit: 0.25,
  maxCreditsWithoutBase: 10000000,
  maxCreditsAllowed: 10000000000000000,
  igbMinTurns: 0,
  igbSvalue: 0.15,
  igbTrate: 1440,
  igbLrate: 1440,
  igbTconsolidate: 10,
  interestRate: 1.0003,
} as const;

export interface IGBBankConfig {
  interest: number;
  paymentFee: number;
  loanInterest: number;
  loanFactor: number;
  loanLimit: number;
  maxCreditsAllowed: number;
  interestRate: number;
}

export const IGB_BANK = BANK_CONFIG;
