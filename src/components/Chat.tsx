import { useState } from "react"
import MessagingArea from "./MessagingArea"
import Message from "./Message"
import styled from "@emotion/styled"
import { createWebsocket, WSEventRecord, WSEventComplete, WSMessage, WSMessageComplete } from "../util/websocket"

export type M = ReturnType<typeof Message>

const Root = styled.main({
	minHeight: "100%",
	gridArea: "chat",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
})

const ChatArea = styled.div({
	flexGrow: 1,
	overflowY: "auto",
	overflowWrap: "break-word",
})

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
