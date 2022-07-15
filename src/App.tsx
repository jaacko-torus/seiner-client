import React, {useRef, useState} from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import dayjs from "dayjs";

type Global = {
    username: string | null
}

const global: Global = {
	username: null
}

const audio = {
	["message-received"]: new Audio("assets/message-received.wav"),
	["poke"]: new Audio("assets/poke.wav"),
}

const themes = {
    "dark": {
        matched: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
        vars: {
            "--background-color": "#000000",
            "--background-color-focus": "#333333",
            "--foreground-color": "#ffffff",
            "--border-unfocused": "#aaaaaa",
            "--font-weight-light": "200",
            "--font-weight-normal": "400",
            "--font-weight-bold": "600",
        }
    },
    "light": {
        matched: window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches,
        vars: {
            "--background-color": "#ffffff",
            "--background-color-focus": "#eeeeee",
            "--foreground-color": "#000000",
            "--border-unfocused": "#555555",
            "--font-weight-light": "300",
            "--font-weight-normal": "400",
            "--font-weight-bold": "500",
        }
    }
}

// const change_theme = (selected_theme: keyof typeof themes) => {
//     const vars = themes[selected_theme].vars
//     const set_property = ([name, value]) => $root.style.setProperty(name, value)
//     Object.entries(vars).forEach(set_property)
//     console.log("themes changed")
// }

function ChatArea() {
	return (
		<div id="chat_area"></div>
	)
}

function MessagingArea(props: {$messaging_data: React.RefObject<HTMLTextAreaElement>}) {
	return (
		<div id="messaging_area">
			<label>
				<textarea ref={props.$messaging_data} id="messaging_data" maxLength={200} minLength={1} placeholder="Type a message" wrap="soft"></textarea>
				<button id="messaging_button">Send</button>
			</label>
		</div>
	)
}



/**
 * Spawns message in html
 */
function Message(props: { username: string, timestamp: string, body: string }) {
    if (props.body.match(new RegExp(`\/poke ${global.username}`))?.length === 1) {
        audio["poke"].play()
    } else if (props.username !== global.username) {
        audio["message-received"].play()
    }

	return (
        <div className="message">
            <div className="message_head">
                <span className="message_username">{props.username}</span> @ <span className="message_timestamp">{props.timestamp}</span>
            </div>
            <div className="message_body">
                <p>{props.body}</p>
            </div>
        </div>
	)
}

function createWebSocket(setMessages: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
    const events = {
        onmessage: (event: MessageEvent<any>) => {
            type WSMessageType = "message" | "user_joined" | "user_left"
            type WSMessageDataDefault = { username: string, timestamp: string }
            type WSMessageDataMessage = WSMessageDataDefault & { message: string }
            type WSMessageDataUserJoined = WSMessageDataDefault
            type WSMessageDataUserLeft = WSMessageDataDefault
            type WSMessageData = WSMessageDataMessage & WSMessageDataUserJoined & WSMessageDataUserLeft

            type WSMessage = { type: WSMessageType, data: WSMessageData }
            const wsMessage: WSMessage = JSON.parse(event.data)

            const events: Record<WSMessageType, (data: WSMessageData) => ReturnType<typeof Message>> = {
                "message": (data: WSMessageDataMessage) =>
                    <Message username={data.username} timestamp={data.timestamp} body={data.message}/>,
                "user_joined": (data: WSMessageDataUserJoined) =>
                    <Message username="[server]" timestamp={data.timestamp} body={`${data.username} has joined`}/>,
                "user_left": (data: WSMessageDataUserLeft) =>
                    <Message username="[server]" timestamp={data.timestamp} body={`${data.username} has left`}/>,
            }

            setMessages(messages => [...messages, events[wsMessage.type](wsMessage.data)])
        },
        onopen: (event: Event) => {
            setMessages(messages => [
                ...messages,
                <Message username="[server]" timestamp={dayjs().format("hh:mma")} body="[open] Connection established"/>
            ])
        },
        onclose: (event:  CloseEvent) => {
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

    const socket = new WebSocket(`ws://${window.location.hostname}:8081/greeter?username=${global.username}`)
    socket.onmessage = events.onmessage
    socket.onopen = events.onopen
    socket.onclose = events.onclose
    socket.onerror = events.onerror
    return socket
}

function App() {
    const bottomMostMessage = useRef()

    const [messages, setMessages] = useState([] as (ReturnType<typeof Message>)[])

    const send_data = (socket: WebSocket) => (data = "") => {
        const body = $messaging_data.value
        $messaging_data.value = ""

        const val = [data.trim(), body.trim()].find(e => e !== "")

        if (val === undefined) return

        socket.send(val)
    }

	global.username = window.prompt("what is your username") ?? "";
    const socket = createWebSocket(setMessages)

    const $messaging_data = useRef<HTMLTextAreaElement>(null)

	const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && document.activeElement === $messaging_data.current) {
            send_data(socket)()
        }

        if (e.key === "Escape") {
            $messaging_data.current?.blur()
        }

        // what is this true about?
        return true
	}

	return (
        <>
            <button id="toggle_theme"></button>
            <main id="chat" onKeyDown={onKeyDown}>
                <div id="chat_area"></div>
                <MessagingArea $messaging_data={$messaging_data}/>
            </main>
        </>
	)
}

export default App
