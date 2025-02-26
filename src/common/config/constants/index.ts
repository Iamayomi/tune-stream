import { generateDays, generateHours, generateMinutes } from '../../library';

/** Time in `minute`, ` hour` and `day` expressed in `milliseconds` */
export const timeIn = {
  /** Time in `minutes` expressed in `milliseconds` */
  minutes: generateMinutes(),
  /** Time in `hours` expressed in `milliseconds` */
  hours: generateHours(),
  /** Time in `days` expressed in `milliseconds` */
  days: generateDays(),
};
