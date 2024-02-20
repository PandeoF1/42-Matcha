import { useEffect, useMemo, useState } from "react"
import instance from "../api/Instance"
import { List, TextField } from "@mui/material"

const Chat = () => {
    const socketChat = useMemo(() => {
        return new WebSocket(import.meta.env.VITE_WS_API + "/chat?token=" + localStorage.getItem("token")!)
    }, [])
    const [data, setData] = useState<any>()
    const [roomId, setRoomId] = useState<any>()
    const [messages, setMessages] = useState<any>([])
    socketChat.onmessage = (event) => {
        setMessages([event.data, ...messages])
    }
    const [message, setMessage] = useState<string>("")
    const getChat = async () => {
        await instance.get('/chat').then((res) => {
            console.log(res.data)
            setData(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        getChat()
        return () => {
            socketChat.close()
        }
    }, [])


    return (
        null
        // <div className="chatParent w-100 h-100">
        //     <List className="chatList">
        //         {likes && likes.map((like: LikeModel, index: number) => {
        //             return (
        //                 <div className="likeListItemParent col-12 col-md-6" key={index}>
        //                     <ListItem alignItems="center" className="likeListItem w-100" onClick={() => { setProfileId(like.id) }}>
        //                         <ListItemAvatar>
        //                             <Avatar alt={like.firstName || "Avatar"} src={index < images.length && images[index] ? images[index].src : goose} />
        //                         </ListItemAvatar>
        //                         <ListItemText
        //                             primary={like.firstName || ""}
        //                             secondary={like.age || ""}
        //                         />
        //                         <KeyboardArrowRightIcon />
        //                     </ListItem>
        //                 </div>
        //             )
        //         })}
        //     </List>
        // </div>
        // <div className="skeletonHeight flex-column">
        //     <select onChange={(e) => {setRoomId(e.target.value)

        //     const room = data?.rooms.find((item: any) => item.id === e.target.value)
        //     console.log(room)
        //     setMessages(room?.messages)}} className="my-2">
        //         <option value="">Select a room</option>
        //         {
        //             data && (data?.rooms.map((item: any) => <option key={item.id}>{item.id}</option>))
        //         }
        //     </select>
        //     <TextField
        //         type="text"
        //         id="outlined-textarea"
        //         onChange={(e) => {
        //             setMessage(e.target.value)
        //         }}
        //     />
        //     <button className="my-2" onClick={async () => {
        //         await instance.post('/chat/' + roomId + '/message', {'content': message }).then((res) => {
        //             console.log(res.data)
        //         }).catch((err) => {
        //             console.log(err)
        //         })
        //     }}>Send</button>
        //     <div className="overflow-scroll">
        //         {
        //             messages && messages.map((item: any) => <div key={item.id}>{item.content} - {item.date}</div>)
        //         }
        //     </div>
        // </div>
    )
}

export default Chat