
interface ChatUser {
    id: string
    firstName: string
    image: string
}

export interface ChatMessage {
    id : string
    user_id: string
    content: string
    date: string
}

export interface ChatRoom {
    id: string
    user_1: ChatUser
    user_2: ChatUser
    messages : ChatMessage[]
}

export interface ChatModel {
    count : number
    rooms : ChatRoom[]
}