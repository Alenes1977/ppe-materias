/**
 * Convierte un string a un formato "slug" (URL-friendly).
 * Ej: "Mi Asignatura Genial" -> "mi-asignatura-genial"
 * @param text El texto a convertir.
 * @returns El texto en formato slug.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normaliza para separar acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos (acentos)
    .replace(/\s+/g, '-') // Reemplaza espacios con -
    .replace(/[^\w-]+/g, '') // Elimina caracteres no alfanuméricos (excepto -)
    .replace(/--+/g, '-'); // Reemplaza múltiples - con uno solo
};
