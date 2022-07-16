import React, { useRef, useState } from "react"
import MessagingArea from "./MessagingArea"
import Message from "./Message"
import { audio } from "../globals"
import dayjs from "dayjs"

export function createWebSocket(username: string, setMessages: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
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
                "message": (data: WSMessageDataMessage) =>
                    <Message username={data.username} timestamp={data.timestamp} body={data.message}/>,
                "user_joined": (data: WSMessageDataUserJoined) =>
                    <Message username="[server]" timestamp={data.timestamp} body={`${data.username} has joined`}/>,
                "user_left": (data: WSMessageDataUserLeft) =>
                    <Message username="[server]" timestamp={data.timestamp} body={`${data.username} has left`}/>,
            }

			const poke = wsMessage.data.message.match(new RegExp(`\/poke ${username}`))?.length === 1
			const messageNotFromThisUser = wsMessage.data.username !== username
			
			if (poke) {
				audio["poke"].play()
			} else if (messageNotFromThisUser) {
				audio["message-received"].play()
			}
			
            setMessages(messages => [...messages, events[wsMessage.type](wsMessage.data)])
        },
        onopen: (event: Event) => {
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
	const [messages, setMessages] = useState<(ReturnType<typeof Message>)[]>([])
	const messagingDataRef = useRef<HTMLTextAreaElement>(null)
	const socket = createWebSocket(username, setMessages)

	const sendData = (socket: WebSocket) => (data = "") => {
		const $messaging_data = messagingDataRef.current
		if ($messaging_data === null)
			return

		// store temporary copy
		const body = $messaging_data.value
		$messaging_data.value = ""

		const val = [data.trim(), body.trim()].find(e => e !== "")

		if (val === undefined)
			return

		socket.send(val)
	}

	const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
		if (e.key === "Enter" && document.activeElement === messagingDataRef.current) {
			sendData(socket)()
		}

		if (e.key === "Escape") {
			messagingDataRef.current?.blur()
		}

		// what is this true about?
		return true
	}

	return (
		<main id="chat" onKeyDown={onKeyDown}>
			<div id="chat_area">{messages}</div>
			<MessagingArea messagingDataRef={messagingDataRef} />
		</main>
	)
}

export default Chat
