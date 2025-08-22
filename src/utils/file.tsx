// Функция для создания File объектов из URL
const createFileFromUrl = async (url: string, filename: string): Promise<File> => {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        return new File([blob], filename, { type: blob.type })
    } catch (error) {
        // Если не удается загрузить, создаем пустой файл
        return new File([""], filename, { type: "image/jpeg" })
    }
}
