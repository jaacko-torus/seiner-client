import type { Theme } from "../../globals"

import { useState } from "react"
import { themes } from "../../globals"
import Chat from "../Chat"

import { Root, ToggleTheme } from "./styled"

const App = () => {
    const [theme, setTheme] = useState<Theme>("dark")
	const [username, setUsername] = useState(() => window.prompt("what is your username") ?? "")
	
	const changeTheme = (theme: Theme) => {
		const vars = themes[theme].vars
		// TODO: style prop is not part of `Element`? Even though I can use it.
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
        <Root>
            <ToggleTheme onClick={e => changeTheme(toggleTheme(theme))}></ToggleTheme>
            <Chat username={username}/>
        </Root>
	)
}

export default App
