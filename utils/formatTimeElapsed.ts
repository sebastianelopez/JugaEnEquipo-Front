const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerWeek = 7;
const daysPerMonth = 30;
const daysPerYear = 365;

interface Translations {
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

export const formatTimeElapsed = (date: Date, translations: Translations) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / secondsPerMinute);
  const diffHours = Math.floor(diffMinutes / minutesPerHour);
  const diffDays = Math.floor(diffHours / hoursPerDay);

  if (diffDays >= daysPerYear) {
    const years = Math.floor(diffDays / daysPerYear);
    return `${translations.timePrefixText}${years} ${
      years > 1
        ? translations.timeYearsSuffixText
        : translations.timeYearSuffixText
    }`;
  } else if (diffDays >= daysPerMonth) {
    const months = Math.floor(diffDays / daysPerMonth);
    return `${translations.timePrefixText}${months} ${
      months > 1
        ? translations.timeMonthsSuffixText
        : translations.timeMonthSuffixText
    }`;
  } else if (diffDays >= daysPerWeek) {
    const weeks = Math.floor(diffDays / daysPerWeek);
    return `${translations.timePrefixText}${weeks} ${
      weeks > 1
        ? translations.timeWeeksSuffixText
        : translations.timeWeekSuffixText
    }`;
  } else if (diffDays >= 1) {
    return `${translations.timePrefixText}${diffDays} ${
      diffDays > 1
        ? translations.timeDaysSuffixText
        : translations.timeDaySuffixText
    }`;
  } else if (diffHours >= 1) {
    return `${translations.timePrefixText}${diffHours} ${
      diffHours > 1
        ? translations.timeHoursSuffixText
        : translations.timeHourSuffixText
    }`;
  } else if (diffMinutes >= 1) {
    return `${translations.timePrefixText}${diffMinutes} ${
      diffMinutes > 1
        ? translations.timeMinutesSuffixText
        : translations.timeMinuteSuffixText
    }`;
  } else {
    return `${translations.timePrefixText}${diffSeconds} ${
      diffSeconds > 1
        ? translations.timeSecondsSuffixText
        : translations.timeSecondSuffixText
    }`;
  }
};
