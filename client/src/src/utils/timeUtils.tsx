export const lastActivity = (lastSeen: number | null) => {
    if (lastSeen === null)
        return "Lost in the void"
    const date = new Date(lastSeen * 1000)
    const now = new Date()
    const diff = Math.abs(now.getTime() - date.getTime())
    const days = Math.floor(diff / (1000 * 3600 * 24))
    if (days === 0)
        return "Online less than a day ago"
    else if (days > 0 && days <= 7)
        return `Online ${days} days ago`
    else if (days > 7)
        return "Online more than a week ago"
    else
        return "Lost in the void"
}