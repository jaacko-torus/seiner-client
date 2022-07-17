import styled from "@emotion/styled"

export const Root = styled.div({
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

export const ToggleTheme = styled.button({
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
