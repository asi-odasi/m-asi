/** Bazı Hugging Face kayıtlarında PDF çıkarımından kalan "˿" işaretçilerini temizler. */
export function cleanBulletinText(text: string): string {
  return text
    .replace(/˿/g, "")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  const clean = text.trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength).trim()}…` : clean;
}
