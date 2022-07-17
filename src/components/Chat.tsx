import React, { createRef, useEffect, useRef, useState } from "react"
import MessagingArea from "./MessagingArea"
import Message from "./Message"
import { audio } from "../globals"
import dayjs from "dayjs"

type M = ReturnType<typeof Message>

export function createWebSocket(username: string, setMessages: React.Dispatch<React.SetStateAction<M[]>>) {
	//, messages: React.MutableRefObject<M[]>) {
	//setMessages: React.Dispatch<React.SetStateAction<M[]>>) {
		
	type WSMessageType = "message" | "user_joined" | "user_left"
	
	type WSMessageDataDefault = { username: string, timestamp: string }
	type WSMessageDataMessage = WSMessageDataDefault & { message: string }
	type WSMessageDataUserJoined = WSMessageDataDefault
	type WSMessageDataUserLeft = WSMessageDataDefault
	type WSMessageData = WSMessageDataMessage & WSMessageDataUserJoined & WSMessageDataUserLeft

	type WSMessage = { type: WSMessageType, data: WSMessageData }
	
    const events = {
        onmessage: (event: MessageEvent<string>) => {
            const wsMessage: WSMessage = JSON.parse(event.data)
			
            const events: Record<WSMessageType, (data: WSMessageData) => ReturnType<typeof Message>> = {
                "message": ({username, timestamp, message}: WSMessageDataMessage) =>
                    <Message username={username} timestamp={timestamp} body={message}/>,
                "user_joined": ({username, timestamp}: WSMessageDataUserJoined) =>
                    <Message username="[server]" timestamp={timestamp} body={`${username} has joined`}/>,
                "user_left": ({username, timestamp}: WSMessageDataUserLeft) =>
                    <Message username="[server]" timestamp={timestamp} body={`${username} has left`}/>,
            }

			const poke = (wsMessage.data.message?.match(new RegExp(`\/poke ${username}`))?.length ?? 0) === 1
			const messageNotFromThisUser = wsMessage.data.username !== username
			
			if (poke) {
				audio["poke"].play()
			} else if (messageNotFromThisUser) {
				audio["message-received"].play()
			}
			
			console.log("received?")
			
			//messages.current.push(events[wsMessage.type](wsMessage.data))
            setMessages(messages => [...messages, events[wsMessage.type](wsMessage.data)])
        },
        onopen: (event: Event) => {
			// const ref = useRef<HTMLDivElement>(null)
			
			// messages.current.push(<Message username="[server]" timestamp={dayjs().format("hh:mma")} body="[open] Connection established"/>)
            setMessages(messages => [
                ...messages,
				<Message username="[server]" timestamp={dayjs().format("hh:mma")} body="[open] Connection established"/>
            ])
        },
        onclose: (event: CloseEvent) => {
            // if (event.wasClean) {
            //     MaterializeMessage("[server]", event.data.timestamp, `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
            // } else {
            //     // server process killed or network down, event.code is *usually* 1006 in this case
            //     MaterializeMessage("[server]", event.data.timestamp, "[close] Connection died")
            // }
        },
        onerror: (error: Event) => {
            // MaterializeMessage("[server]", error.data.timestamp ?? dayjs().format("hh:mma"), `[error] ${error.message}`)
        },
    }

    const socket = new WebSocket(`ws://${window.location.hostname}:8081/greeter?username=${username}`)
    socket.onmessage = events.onmessage
    socket.onopen = events.onopen
    socket.onclose = events.onclose
    socket.onerror = events.onerror
	
    return socket
}

export interface Args { username: string }
const Chat = ({ username }: Args) => {
	const [messages, setMessages] = useState<M[]>([])
	const messagingDataRef = useRef<HTMLTextAreaElement>(null)
	
	const [socket] = useState(() => createWebSocket(username, setMessages))

	const sendData = (data: string) => {
		socket.send(data)
		console.log("something happening?")
	}

	return (
		<main id="chat">
			<div id="chat_area">{messages}</div>
			<MessagingArea sendData={sendData} messagingDataRef={messagingDataRef} />
		</main>
	)
}

export default Chat
