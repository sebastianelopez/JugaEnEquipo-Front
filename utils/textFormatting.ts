/**
 * Capitalizes the first letter of a string and makes the rest lowercase
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns The string with each word capitalized
 */
export const capitalizeWords = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};

/**
 * Formats a full name by capitalizing first and last names
 * @param firstName - The first name
 * @param lastName - The last name
 * @returns The formatted full name
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  const formattedFirstName = capitalizeFirstLetter(firstName);
  const formattedLastName = capitalizeFirstLetter(lastName);
  
  if (!formattedFirstName && !formattedLastName) {
    return '';
  }
  
  if (!formattedFirstName) {
    return formattedLastName;
  }
  
  if (!formattedLastName) {
    return formattedFirstName;
  }
  
  return `${formattedFirstName} ${formattedLastName}`;
};