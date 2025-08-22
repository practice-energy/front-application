/**
 * Создает File объект из URL изображения
 * @param url URL изображения
 * @param filename Имя файла
 * @returns Promise<File>
 */
async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Конвертирует массив URL в массив File объектов
 * @param urls Массив URL изображений
 * @returns Promise<File[]>
 */
export async function convertUrlsToFiles(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const url of urls) {
    try {
      // Извлекаем имя файла из URL или генерируем случайное
      const filename = url.split('/').pop() || `image-${Date.now()}.jpg`;
      const file = await urlToFile(url, filename);
      files.push(file);
    } catch (error) {
      console.error(`Failed to convert URL to File: ${url}`, error);
    }
  }

  return files;
}
