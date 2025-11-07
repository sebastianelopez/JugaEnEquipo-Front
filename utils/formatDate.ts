
interface DateFormatOptions {
  locale?: 'es' | 'en' | 'pt';
  includeTime?: boolean;
  includeSeconds?: boolean;
  use24Hour?: boolean;
}

const TRANSLATIONS = {
  es: {
    days: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  },
  en: {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  pt: {
    days: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    months: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  }
};

/**
 * Formats a date string in a way that's consistent between server and client
 * to avoid hydration errors
 */
export const formatDate = (
  isoString: string, 
  options: DateFormatOptions = {}
): string => {
  const {
    locale = 'es',
    includeTime = true,
    includeSeconds = false,
    use24Hour = false
  } = options;

  try {
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return isoString; // Return original string if parsing fails
    }

    // Get translations for the specified locale
    const translations = TRANSLATIONS[locale] || TRANSLATIONS.es;
    
    const dayName = translations.days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const monthName = translations.months[date.getMonth()];
    
    let formattedDate = `${dayName}, ${day} ${monthName}`;
    
    if (includeTime) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      if (use24Hour) {
        const hoursStr = hours.toString().padStart(2, '0');
        formattedDate += `, ${hoursStr}:${minutes}`;
        if (includeSeconds) {
          const seconds = date.getSeconds().toString().padStart(2, '0');
          formattedDate += `:${seconds}`;
        }
      } else {
        // Convert to 12-hour format consistently
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        formattedDate += `, ${hours}:${minutes} ${ampm}`;
      }
    }
    
    return formattedDate;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return isoString; // Fallback to original string
  }
};

/**
 * Formats date for upcoming events specifically
 * Uses a shorter format: "lun, 06 oct, 11:00" (Spanish example)
 */
export const formatEventDateTime = (isoString: string, locale: 'es' | 'en' | 'pt' = 'es'): string => {
  return formatDate(isoString, {
    locale,
    includeTime: true,
    use24Hour: true
  });
};

/**
 * Alternative hydration-safe formatter using Intl.DateTimeFormat with fixed options
 * This approach ensures consistent formatting across server and client
 */
export const formatDateTimeIntl = (isoString: string, locale: 'es' | 'en' | 'pt' = 'es'): string => {
  try {
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return isoString;
    }

    // Map our locales to Intl locales
    const intlLocales: Record<string, string> = {
      es: 'es-ES',
      en: 'en-US',
      pt: 'pt-BR'
    };

    const intlLocale = intlLocales[locale] || 'es-ES';

    // Use explicit format options to ensure consistency
    const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC' // Force UTC to avoid timezone differences between server/client
    });

    const timeFormatter = new Intl.DateTimeFormat(intlLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });

    const datePart = dateFormatter.format(date);
    const timePart = timeFormatter.format(date);
    
    return `${datePart}, ${timePart}`;
  } catch (error) {
    console.warn('Error formatting date with Intl:', error);
    return formatEventDateTime(isoString, locale); // Fallback to manual formatter
  }
};