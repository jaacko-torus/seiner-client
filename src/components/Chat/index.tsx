import { v4 as uuidv4 } from "uuid"
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
			<ChatArea>{messages.map(({ data }) => <Message key={uuidv4()} {...data}/>)}</ChatArea>
			<MessagingArea sendData={async e => (await socket).send(e)} />
		</Root>
	)
}

export default Chat
