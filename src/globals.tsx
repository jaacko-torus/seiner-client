export const audio = {
	["message-received"]: new Audio("assets/message-received.wav"),
	["poke"]: new Audio("assets/poke.wav"),
}

export type Theme = "dark" | "light"
export type Themes = Record<Theme, { matched: boolean, vars: Record<string, string> }>
export const themes: Themes = {
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
