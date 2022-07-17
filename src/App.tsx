import {useState} from "react"
import {Theme, themes} from "./globals"
import Chat from "./components/Chat"
import styled from "@emotion/styled"

const Root = styled.div({
    backgroundColor: "var(--background-color)",
    color: "var(--foreground-color)",
    fontFamily: "\"Montserrat\", sans-serif",
    fontWeight: "var(--font-weight-normal)",
    padding: "1em",
    height: "calc(100% - 2em)",
    display: "grid",
	// textAlign: "initial",
    gridTemplate: "\"chat\" 1fr / 100%",
})

const ToggleTheme = styled.button({
	position: "absolute",
    right: "1em",
    backgroundColor: "var(--background-color)",
    width: "50px",
    height: "50px",
    border: "var(--foreground-color) 2px solid",
    borderRadius: "100%",
    boxShadow: "0 0 var(--background-color)",
    transition: "500ms linear",
	":hover": {
		cursor: "pointer",
		backgroundColor: "var(--foreground-color)",
		boxShadow: "3px 4px var(--border-unfocused)",
	},
})

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
