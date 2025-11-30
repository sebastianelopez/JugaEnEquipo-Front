/**
 * Utility functions for handling image file uploads
 */

export interface ImageFileOptions {
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Whether to validate file type (default: true) */
  validateType?: boolean;
  /** Callback when image is successfully loaded as base64 */
  onLoad?: (base64String: string) => void;
  /** Callback when there's an error */
  onError?: (error: string) => void;
}

/**
 * Validates an image file
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns Error message if invalid, null if valid
 */
export const validateImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024
): string | null => {
  if (!file.type.startsWith("image/")) {
    return "El archivo debe ser una imagen";
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `El archivo es demasiado grande. Máximo ${maxSizeMB}MB permitido`;
  }

  return null;
};

/**
 * Converts a file to base64 string
 * @param file - The file to convert
 * @param options - Configuration options
 * @returns Promise that resolves with the base64 string
 */
export const fileToBase64 = (
  file: File,
  options: ImageFileOptions = {}
): Promise<string> => {
  const {
    maxSize = 5 * 1024 * 1024,
    validateType = true,
    onError,
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (validateType) {
      const validationError = validateImageFile(file, maxSize);
      if (validationError) {
        const error = validationError;
        onError?.(error);
        reject(new Error(error));
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      options.onLoad?.(base64String);
      resolve(base64String);
    };
    reader.onerror = () => {
      const error = "Error al leer el archivo";
      onError?.(error);
      reject(new Error(error));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Handles image file change event for formik forms
 * Converts file to base64 and updates both preview and form field
 * @param event - The file input change event
 * @param setFieldValue - Formik's setFieldValue function
 * @param setPreview - State setter for preview image
 * @param options - Additional options for validation
 */
export const handleImageFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: any) => void,
  setPreview?: (preview: string | null) => void,
  options: Omit<ImageFileOptions, "onLoad"> = {}
): void => {
  const file = event.target.files?.[0];
  if (!file) return;

  fileToBase64(file, {
    ...options,
    onLoad: (base64String) => {
      setPreview?.(base64String);
      setFieldValue("image", base64String);
    },
    onError: (error) => {
      console.error("Error processing image:", error);
      // Optionally show error feedback here
    },
  }).catch((error) => {
    console.error("Error converting file to base64:", error);
  });
};

/**
 * Handles image file change event for simple preview (no formik)
 * Converts file to base64 and updates preview state
 * @param event - The file input change event
 * @param setPreview - State setter for preview image
 * @param setFile - Optional state setter for the File object
 * @param options - Additional options for validation
 */
export const handleImagePreviewChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setPreview: (preview: string | null) => void,
  setFile?: (file: File | null) => void,
  options: Omit<ImageFileOptions, "onLoad"> = {}
): void => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Set the file first if callback provided
  setFile?.(file);

  fileToBase64(file, {
    ...options,
    onLoad: (base64String) => {
      setPreview(base64String);
    },
    onError: (error) => {
      console.error("Error processing image:", error);
      setPreview(null);
      setFile?.(null);
    },
  }).catch((error) => {
    console.error("Error converting file to base64:", error);
    setPreview(null);
    setFile?.(null);
  });
};

