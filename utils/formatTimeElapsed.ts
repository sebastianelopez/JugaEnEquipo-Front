import { useTranslations } from "next-intl";

const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerWeek = 7;
const daysPerMonth = 30;
const daysPerYear = 365;

export const formatTimeElapsed = (date: Date) => {
  const t = useTranslations("Time");
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / secondsPerMinute);
  const diffHours = Math.floor(diffMinutes / minutesPerHour);
  const diffDays = Math.floor(diffHours / hoursPerDay);

  if (diffDays >= daysPerYear) {
    const years = Math.floor(diffDays / daysPerYear);
    return `${t("timePrefixText")}${years} ${
      years > 1 ? t("timeYearsSuffixText") : t("timeYearSuffixText")
    }`;
  } else if (diffDays >= daysPerMonth) {
    const months = Math.floor(diffDays / daysPerMonth);
    return `${t("timePrefixText")}${months} ${
      months > 1 ? t("timeMonthsSuffixText") : t("timeMonthSuffixText")
    }`;
  } else if (diffDays >= daysPerWeek) {
    const weeks = Math.floor(diffDays / daysPerWeek);
    return `${t("timePrefixText")}${weeks} ${
      weeks > 1 ? t("timeWeeksSuffixText") : t("timeWeekSuffixText")
    }`;
  } else if (diffDays >= 1) {
    return `${t("timePrefixText")}${diffDays} ${
      diffDays > 1 ? t("timeDaysSuffixText") : t("timeDaySuffixText")
    }`;
  } else if (diffHours >= 1) {
    return `${t("timePrefixText")}${diffHours} ${
      diffHours > 1 ? t("timeHoursSuffixText") : t("timeHourSuffixText")
    }`;
  } else if (diffMinutes >= 1) {
    return `${t("timePrefixText")}${diffMinutes} ${
      diffMinutes > 1 ? t("timeMinutesSuffixText") : t("timeMinuteSuffixText")
    }`;
  } else {
    return `${t("timePrefixText")}${diffSeconds} ${
      diffSeconds > 1 ? t("timeSecondsSuffixText") : t("timeSecondSuffixText")
    }`;
  }
};
