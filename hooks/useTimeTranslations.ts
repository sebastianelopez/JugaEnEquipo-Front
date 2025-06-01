import { useTranslations } from "next-intl";

export interface TimeTranslations {
  timePrefixText: string;
  timeYearsSuffixText: string;
  timeYearSuffixText: string;
  timeMonthsSuffixText: string;
  timeMonthSuffixText: string;
  timeWeeksSuffixText: string;
  timeWeekSuffixText: string;
  timeDaysSuffixText: string;
  timeDaySuffixText: string;
  timeHoursSuffixText: string;
  timeHourSuffixText: string;
  timeMinutesSuffixText: string;
  timeMinuteSuffixText: string;
  timeSecondsSuffixText: string;
  timeSecondSuffixText: string;
}

export const useTimeTranslations = (): TimeTranslations => {
  const timeT = useTranslations("Time");

  return {
    timePrefixText: timeT("timePrefixText"),
    timeYearsSuffixText: timeT("timeYearsSuffixText"),
    timeYearSuffixText: timeT("timeYearSuffixText"),
    timeMonthsSuffixText: timeT("timeMonthsSuffixText"),
    timeMonthSuffixText: timeT("timeMonthSuffixText"),
    timeWeeksSuffixText: timeT("timeWeeksSuffixText"),
    timeWeekSuffixText: timeT("timeWeekSuffixText"),
    timeDaysSuffixText: timeT("timeDaysSuffixText"),
    timeDaySuffixText: timeT("timeDaySuffixText"),
    timeHoursSuffixText: timeT("timeHoursSuffixText"),
    timeHourSuffixText: timeT("timeHourSuffixText"),
    timeMinutesSuffixText: timeT("timeMinutesSuffixText"),
    timeMinuteSuffixText: timeT("timeMinuteSuffixText"),
    timeSecondsSuffixText: timeT("timeSecondsSuffixText"),
    timeSecondSuffixText: timeT("timeSecondSuffixText"),
  };
};
