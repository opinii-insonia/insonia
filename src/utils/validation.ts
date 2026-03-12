export const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isValidPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};