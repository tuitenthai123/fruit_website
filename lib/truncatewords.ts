export const truncateWords = (str: string, wordLimit: number) => {
    if (!str) return ''
    const words = str.split(' ')
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(' ') + '...'
        : str
}