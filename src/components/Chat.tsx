import React, { createRef, useEffect, useRef, useState } from "react"
import MessagingArea from "./MessagingArea"
import Message from "./Message"
import { audio } from "../globals"
import dayjs from "dayjs"

type M = ReturnType<typeof Message>

function websocketCloseEventReasonHandler(code: number) {
	// See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
	let reasonMapper: Record<number, string> = {
		1000:
			"Normal closure, meaning that the purpose for which the connection was established has been fulfilled.",
		1001:
			`An endpoint is "going away", such as a server going down or a browser having navigated away from a page.`,
		1002:
			"An endpoint is terminating the connection due to a protocol error",
		1003:
			"An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).",
		1004:
			"Reserved. The specific meaning might be defined in the future.",
		1005:
			"No status code was actually present.",
		1006:
			"The connection was closed abnormally, e.g., without sending or receiving a Close control frame",
		1007:
			"An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).",
		1008:
			`An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other suitable reason, or if there is a need to hide specific details about the policy.`,
		1009:
			"An endpoint is terminating the connection because it has received a message that is too big for it to process.",
		1010:
			// Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
			`An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.\nSpecifically, the extensions that are needed are: ${code}.`,
		1011:
			"A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.",
		1015:
			"The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
	}
	
	return (reasonMapper[code] ?? "Unknown reason.") + "\nFor more information, see https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1."
}

function createWebsocket(username: string, setMessages: React.Dispatch<React.SetStateAction<M[]>>) {
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
			
            setMessages(messages => [...messages, events[wsMessage.type](wsMessage.data)])
        },
        onopen: (event: Event) => {
            setMessages(messages => [
                ...messages,
				<Message username="[server]" timestamp={dayjs().format("hh:mma")} body="[open] Connection established"/>
            ])
        },
        onclose: (event: CloseEvent) => {
			const reason = websocketCloseEventReasonHandler(event.code)
			
			setMessages(messages => [
				...messages,
				<Message
					username="[server]"
					timestamp={dayjs().format("hh:mma")}
					body={[
						`[close] Connection ${event.wasClean ? "closed cleanly" : "died"}`,
						`\tcode=${event.code}`,
						`\treason=${websocketCloseEventReasonHandler(event.code)}`
					].join("\n")} />
			])
        },
        onerror: (error: Event) => {
			setMessages(messages => [
				...messages,
				<Message
					username="[server]"
					timestamp={dayjs().format("hh:mma")}
					body={`[error]`}/>
			])
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
	const [socket] = useState(() => createWebsocket(username, setMessages))
	
	return (
		<main id="chat">
			<div id="chat_area">{messages}</div>
			<MessagingArea sendData={e => socket.send(e)} />
		</main>
	)
}

export default Chat
