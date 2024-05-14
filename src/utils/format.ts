export const formatVndCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const generateSlug = (inputString: string): string => {
  return inputString
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters except hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
}
