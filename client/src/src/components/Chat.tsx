import { useEffect, useMemo, useState } from "react"
import instance from "../api/Instance"
import { Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material"
import { ChatMessage, ChatModel, ChatRoom } from "./models/ChatModel"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import goose from "../../assets/goose.jpg"
import SendIcon from '@mui/icons-material/Send';

const Chat = () => {
    const socketChat = useMemo(() => {
        return new WebSocket(import.meta.env.VITE_WS_API + "/chat?token=" + localStorage.getItem("token"))
    }, [])
    const [data, setData] = useState<ChatModel>()
    const [roomSelected, setRoomSelected] = useState<ChatRoom>()
    const scrollToBottom = () => {
        if (roomSelected) {
            const chatBox = document.getElementById("chatZone")
            chatBox?.scrollTo(0, chatBox.scrollHeight)
        }
    }
    socketChat.onmessage = (event) => {
        let data: ChatMessage | null = null
        try {
            data = JSON.parse(event.data)
        } catch (e) {
            console.log(e)
            return
        }
        if (roomSelected && data && data?.id === roomSelected.id) {
            setRoomSelected((room) => {
                if (!room || !data) return room
                return {
                    ...room,
                    messages: [...room.messages, {
                        ...data,
                        id: data.id,
                    }],
                }
            })
        }
    }
    const [currentMessage, setCurrentMessage] = useState<string>("")
    const getChat = async () => {
        await instance.get<ChatModel>('/chat').then((res) => {
            console.log(res.data)
            setData(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    const postMessage = async () => {
        if (!roomSelected) return
        const tempMessage = currentMessage
        setCurrentMessage("")
        instance.post('/chat/' + roomSelected.id + '/message', { 'content': tempMessage }).then(() => {
            setCurrentMessage("")
        }).catch(() => {
            setCurrentMessage(tempMessage)
        })
    }
    useEffect(() => {
        getChat()
        return () => {
            socketChat.close()
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [roomSelected])


    return (
        <div className="chatParent w-100 h-100">
            {roomSelected ?
                <Box
                    className="chatBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "grey.200",
                    }}
                >
                    <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }} id="chatZone">
                        {roomSelected.messages.map((message, index: number) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: message.user_id === roomSelected.user_2.id ? "flex-start" : "flex-end",
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: message.user_id === roomSelected.user_2.id ? "row" : "row-reverse",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: message.user_id === roomSelected.user_2.id ? "primary" : "secondary" }}>
                                        {message.user_id === roomSelected.user_2.id ? "B" : "U"}
                                    </Avatar>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1,
                                            ml: message.user_id === roomSelected.user_2.id ? 1 : 0,
                                            mr: message.user_id === roomSelected.user_2.id ? 0 : 1,
                                            backgroundColor: message.user_id === roomSelected.user_2.id ? "primary.light" : "secondary.light",
                                            borderRadius: message.user_id === roomSelected.user_2.id ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                                        }}
                                    >
                                        <Typography variant="body1">{message.content}</Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    // put max length
                                    placeholder="Type a message"
                                    variant="outlined"
                                    // value={currentMessage}
                                    // onChange={(e) => setCurrentMessage(e.target.value)}
                                    // after delay i want to save the value of the input
                                    onChange={(e) => {
                                        // setCurrentMessage(e.target.value) after 500ms
                                        let id = setTimeout(() => {
                                            setCurrentMessage(e.target.value)

                                            return () => {
                                                clearTimeout(id)
                                            }
                                        }, 500)
                                    }}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            await postMessage()
                                        }
                                    }
                                    }
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={async () => {
                                        await postMessage()
                                    }}
                                >
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                :
                <>
                    <Typography variant="h6" fontWeight="bold">CHATS</Typography>
                    <List className="chatList">
                        {data && data.rooms.map((room: ChatRoom, index: number) => {
                            return (
                                <div className="chatListItemParent w-100" key={index}>
                                    <ListItem alignItems="center" className="chatListItem w-100" onClick={() => { setRoomSelected(room) }}>
                                        <ListItemAvatar>
                                            <Avatar alt={room.user_2?.firstName || "Avatar"} src={room.user_2?.image ? room.user_2.image : goose} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={room.user_2?.firstName || ""}
                                            secondary={room.messages?.length ? room.messages[room.messages.length - 1].content : "Say hi to your match!"}
                                        />
                                        <KeyboardArrowRightIcon />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </div>
                            )
                        })}
                    </List>
                </>
            }
        </div>
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