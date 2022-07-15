import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"

type Global = { username: string | null }

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

function MessagingArea() {
	return (
		<div id="messaging_area">
			<label>
				<textarea id="messaging_data" maxLength={200} minLength={1} placeholder="Type a message" wrap="soft"></textarea>
				<button id="messaging_button">Send</button>
			</label>
		</div>
	)
}

const send_data = (socket: WebSocket) => (data = "") => {
    const body = $messaging_data.value
    $messaging_data.value = ""

    const val = [data.trim(), body.trim()].find(e => e !== "")

    if (val === undefined) return

    socket.send(val)
}

/**
 * Spawns message in html
 */
 function MaterializeMessage(username: string, timestamp: string, body: string) {
	let x = (
		<>
			<span className="message_username">{username}</span> @ <span className="message_timestamp">{timestamp}</span>
		</>
	)
	
    let $message = document.createElement("div")
    let $header = document.createElement("div")
    // let $username = document.createElement("span")
    let $timestamp = document.createElement("span")
    let $body = document.createElement("div")
    let $p = document.createElement("p")

    // ------------------------------------------------------------------------

    $message.classList.add("message")
    $header.classList.add("message_head")
    // $username.classList.add("message_username")
    $timestamp.classList.add("message_timestamp")
    $body.classList.add("message_body")

    // ------------------------------------------------------------------------

    $username.append(document.createTextNode(username))
    $timestamp.append(document.createTextNode(timestamp))
    $p.append(document.createTextNode(body))

    $header.append($username, document.createTextNode(" @ "), $timestamp)
    $body.append($p)
    $message.append($header, $body)

    $chat_area.append($message)

    $message.scrollIntoView()
}

async function on_message(username, timestamp, body) {
    MaterializeMessage(username, timestamp, body)
	
	if (body.match(new RegExp(`\/poke ${global.username}`))?.length === 1) {
		await audio["poke"].play()
	} else if (username !== global.username) {
		await audio["message-received"].play()	
	}
}

function App() {
	global.username = window.prompt("what is your username") ?? "";
	const socket = new WebSocket(`ws://${window.location.hostname}:8081/greeter?username=${global.username}`)

	type Message = { username: string, timestamp: string, message: string }
	type Event = (data: Message) => void
	socket.onmessage = event => {
        const message = JSON.parse(event.data);
        const events: Record<string, Event> = {
            "message": (data: Message) => on_message(data.username, data.timestamp, data.message),
            "user_joined": (data: Message) => on_message("[server]", data.timestamp, `${data.username} has joined`),
            "user_left": (data: Message) => on_message("[server]", data.timestamp, `${data.username} has left`),
        }

        events[message.type](message.data)
    }

    socket.onopen = event => {
        MaterializeMessage("[server]", dayjs().format("hh:mma"), "[open] Connection established")
    };

    socket.onclose = event => {
        // if (event.wasClean) {
        //     MaterializeMessage("[server]", event.data.timestamp, `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
        // } else {
        //     // server process killed or network down, event.code is *usually* 1006 in this case
        //     MaterializeMessage("[server]", event.data.timestamp, "[close] Connection died")
        // }
    };

    socket.onerror = error => {
        // MaterializeMessage("[server]", error.data.timestamp ?? dayjs().format("hh:mma"), `[error] ${error.message}`)
    };
	
	const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Enter" && document.activeElement === $messaging_data) {
            send_data(socket)()
        }
        if (e.key === "Escape") {
            $messaging_data.blur()
        }
        return true;
	}
	
	const [count, setCount] = useState(0)

	return (
		<div className="App" onKeyDown={onKeyDown}>
			
		</div>
	)
}

export default App
