import React, {useState} from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import dayjs from "dayjs"
import Message from "./components/Message"
import {audio, Theme, themes} from "./globals"
import { css } from "@emotion/css"
import Chat from "./components/Chat"

const App = () => {
    const [theme, setTheme] = useState<Theme>("dark")
	const username = window.prompt("what is your username") ?? ""
	
	const changeTheme = (theme: Theme) => {
		const vars = themes[theme].vars
		const $root: Element & { style: { setProperty: (name: string, value: string) => void } } =
			document.querySelector(":root")!
		const set_property = ([name, value]: [string, string]) => $root.style.setProperty(name, value)
		Object.entries(vars).forEach(set_property)
		console.log("themes changed")
	}
	
	const toggleTheme = (theme: Theme) => {
		const themeMapper: Record<Theme, Theme> = {
			"dark": "light",
			"light": "dark"
		}
		setTheme(themeMapper[theme])
		return theme
	}
	
	return (
        <>
            <button id="toggle_theme" onClick={e => changeTheme(toggleTheme(theme))}></button>
			
            <Chat username={username}/>
        </>
	)
}

export default App
