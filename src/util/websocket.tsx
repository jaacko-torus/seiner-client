import { hocon } from "hocon-web"
import dayjs from "dayjs"
import { audio } from "../globals"

export function websocketCloseEventReasonHandler(code: number) {
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

export type WSEvent = { username: string, timestamp: string }
export type WSEventComplete = WSEvent & { messages: string[] }

export type WSEventRecord = {
	"user_joined": WSEvent
	"user_left": WSEvent
	"message": WSEventComplete
	"open": WSEventComplete
	"close": WSEventComplete
	"error": WSEventComplete
}

export type WSMessage = {
	[Type in keyof WSEventRecord]: { type: Type, data: WSEventRecord[Type] }
}[keyof WSEventRecord]

export type WSMessageComplete = {
	[Type in keyof WSEventRecord]: { type: Type, data: WSEventComplete }
}[keyof WSEventRecord]

export async function createWebsocket(username: string, setMessages: (value: (prevState: WSMessageComplete[]) => WSMessageComplete[]) => void) {
	type Events = {
		onmessage: (event: MessageEvent<string>) => void
		onopen: (event: Event) => void
		onclose: (event: CloseEvent) => void
		onerror: (event: Event) => void
	}

	const events: Events = {
		onmessage: (event) => {
			const message: WSMessage = JSON.parse(event.data)

			switch (message.type) {
				case "message":
					const poked = (message.data.messages.at(0)?.match(new RegExp(`\/poke ${username}`))?.length ?? 0) === 1
					const messageNotFromThisUser = message.data.username !== username

					if (poked) {
						audio["poke"].play()
					} else if (messageNotFromThisUser) {
						audio["message-received"].play()
					}

					return setMessages(messages => [...messages, message])
				case "user_left":
				case "user_joined":
					const action = { user_left: "left", user_joined: "joined" }
					return setMessages(messages => [...messages, {
						type: message.type,
						data: {
							timestamp: message.data.timestamp,
							username: "[server]",
							messages: [`${message.data.username} has ${action[message.type]}`]
						}
					}])
				default:
					// Will never happen
					return
			}
		},
		onopen: (event) => setMessages(messages => [...messages, {
			type: "open",
			data: {
				username: "[server]",
				timestamp: dayjs().format("hh:mma"),
				messages: ["[open] Connection established"]
			}
		}]),
		onclose: (event) => setMessages(messages => [...messages, {
			type: "close",
			data: {
				username: "[server]",
				timestamp: dayjs().format("hh:mma"),
				messages: [
					`[close] Connection ${event.wasClean ? "closed cleanly" : "died"}`,
					`code = ${event.code}`,
					`reason = ${websocketCloseEventReasonHandler(event.code)}`
				]
			}
		}]),
		onerror: (error) => setMessages(messages => [...messages, {
			type: "error",
			data: {
				username: "[server]",
				timestamp: dayjs().format("hh:mma"),
				messages: ["[error]"]
			}
		}])
	}
	
	const instance = await hocon()
	const applicationConfFile = await fetch("./resources/application.conf")
	const applicationConfSource = await applicationConfFile.text()
	const application = new instance.Config(applicationConfSource)
	application.setRenderComments(false)
	application.setRenderOriginComments(false)
	application.setRenderFormatted(false)
	
	// properties I care about
	type ApplicationJSON = {seiner: { mode: "dev" | "prod", modes: {[key in "dev" | "prod"]:{port:{ws: number}}}}}
	const applicationJSON: ApplicationJSON | undefined = JSON.parse(application.toJSON() ?? "undefined") ?? undefined
	const mode: "dev" | "prod" | undefined = applicationJSON?.seiner.mode
	const portWS = (mode && applicationJSON?.seiner.modes[mode].port.ws) ?? 8081

	const socket = new WebSocket(`ws://${window.location.hostname}:${portWS}/greeter?username=${username}`)
	socket.onmessage = events.onmessage
	socket.onopen = events.onopen
	socket.onclose = events.onclose
	socket.onerror = events.onerror
	
	application.delete()

	return socket
}
