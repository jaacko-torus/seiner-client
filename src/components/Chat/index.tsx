import { useState } from "react"
import MessagingArea from "../MessagingArea"
import Message from "../Message"
import { createWebsocket, WSMessageComplete } from "../../util/websocket"
import { Root, ChatArea } from "./styled"

export interface Args { username: string }
const Chat = ({ username }: Args) => {
	const [messages, setMessages] = useState<WSMessageComplete[]>([])
	const [socket] = useState(() => createWebsocket(username, setMessages))
	
	return (
		<Root>
			<ChatArea>{messages.map(({ data }) => <Message {...data}/>)}</ChatArea>
			<MessagingArea sendData={e => socket.send(e)} />
		</Root>
	)
}

export default Chat
