export const generateSlug = (text: string) =>
  text.toLowerCase().replaceAll(' ', '-')
