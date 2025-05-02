/**
 * Normaliza un string para su uso en URLs:
 * - Convierte a minúsculas
 * - Elimina tildes y caracteres especiales
 * - Reemplaza espacios por guiones
 * - Elimina caracteres no alfanuméricos
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
    .replace(/[^a-z0-9\s-]/g, '') // Solo permite letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-'); // Reemplaza espacios por guiones
};

/**
 * Genera un slug para usar en rutas a partir de un string
 * Ejemplo: "Módulo Básico" -> "modulo-basico"
 */
export const generateSlug = (str: string): string => {
  return normalizeString(str);
};
