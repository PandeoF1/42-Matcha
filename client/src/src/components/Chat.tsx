import { useEffect, useMemo, useState } from "react"
import instance from "../api/Instance"
import { Avatar, Badge, BadgeProps, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography, styled } from "@mui/material"
import { ChatMessage, ChatModel, ChatRoom } from "./models/ChatModel"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import goose from "../../assets/goose.jpg"
import SendIcon from '@mui/icons-material/Send';
import { StatusListModel } from "../pages/models/StatusListModel";
import CloseIcon from '@mui/icons-material/Close';
import nobodyGoose from '../../assets/nobody_goose.png'

interface ChatProps {
    statusList: StatusListModel
}
const Chat = ({ statusList }: ChatProps) => {
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

    const getChat = async () => {
        await instance.get<ChatModel>('/chat').then((res) => {
            setData(res.data)
        }).catch(() => {
        })
    }
    const postMessage = async () => {
        if (!roomSelected) return
        const tempMessage = (document.getElementById("newMessage") as HTMLInputElement)?.value || "";
        (document.getElementById("newMessage") as HTMLInputElement).value = ""
        instance.post('/chat/' + roomSelected.id + '/message', { 'content': tempMessage }).then(() => {
        }).catch(() => {
            (document.getElementById("newMessage") as HTMLInputElement).value = tempMessage
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

    const StyledBadge = styled(Badge)<BadgeProps>(() => ({
        '& .MuiBadge-badge': {
            border: `1px solid`,
            width: '14px',
            height: '14px',
            minWidth: '14px',
            color: '#FFFFFF',
            backgroundColor: '#4CAF50',
        },
    }));

    return (
        <div className="chatParent w-100 h-100">
            {roomSelected ?
                <div className="chatChannel">
                    <div className="d-flex justify-content-between w-100 mb-2">
                        <div className="d-flex align-items-center text-truncate">
                            <StyledBadge
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                sx={{ padding: "0 0 2px 2px" }}
                                overlap="circular"
                                badgeContent=" "
                                invisible={statusList && statusList.users && statusList.users.includes(roomSelected?.user_2?.id) ? false : true}
                            >
                                <Avatar alt={roomSelected.user_2?.firstName || "Avatar"} src={roomSelected.user_2?.image ? roomSelected.user_2.image : goose} />
                            </StyledBadge>
                            <Typography ml={1} variant="h6" fontWeight="bold">{roomSelected.user_2?.firstName}</Typography>
                        </div>
                        <Button className="closeButton" onClick={() => { setRoomSelected(undefined) }} title="Close">
                            <CloseIcon color="primary" />
                        </Button>
                    </div>
                    <Box
                        className="chatBox"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "grey.200",
                            borderRadius: "6px",
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
                                        <Avatar src={message.user_id === roomSelected.user_2.id ? (roomSelected.user_2?.image || goose) : (roomSelected.user_1?.image || goose)} />
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
                                            <Typography sx={{ wordBreak: "break-all" }} variant="body1">{message.content}</Typography>
                                        </Paper>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ p: 2, display: "flex" }}>
                            <TextField
                                size="small"
                                fullWidth
                                inputProps={{ maxLength: 400 }}
                                placeholder="Type a message"
                                variant="outlined"
                                id="newMessage"
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        await postMessage()
                                    }
                                }
                                }
                            />
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                                endIcon={<SendIcon />}
                                style={{ marginLeft: "4px", width: "100px" }}
                                onClick={async () => {
                                    await postMessage()
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </Box>
                </div>
                :
                data && data.rooms.length ?
                    <>
                        <Typography variant="h6" fontWeight="bold">CHATS</Typography>
                        <List className="chatList">
                            {data.rooms.map((room: ChatRoom, index: number) => {
                                return (
                                    <div className="chatListItemParent w-100" key={index}>
                                        <ListItem alignItems="center" className="chatListItem w-100" onClick={() => { setRoomSelected(room) }}>
                                            <ListItemAvatar>
                                                <StyledBadge
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                    overlap="circular"
                                                    badgeContent=" "
                                                    sx={{ padding: "0 0 4px 4px" }}
                                                    invisible={statusList && statusList.users && statusList.users.includes(room?.user_2?.id) ? false : true}
                                                >
                                                    <Avatar alt={room.user_2?.firstName || "Avatar"} src={room.user_2?.image ? room.user_2.image : goose} />
                                                </StyledBadge>
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
                    :
                    <div className="skeletonHeight display-flex flex-column position-relative">
                        <Typography className="position-absolute top-0" variant="h6" fontWeight="bold">CHATS</Typography>
                        <img src={nobodyGoose} alt="nobodyGoose" className="w-100" />
                    </div>
            }
        </div>
    )
}

export default Chat