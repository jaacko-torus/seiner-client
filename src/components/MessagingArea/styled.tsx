import styled from "@emotion/styled"

export const Root = styled.div({
	marginTop: "1.5em",
	marginLeft: "0.5em",
	borderTop: "var(--foreground-color) 1px dashed",
	paddingTop: "2em",
})

export const Label = styled.label({
	display: "flex",
	gap: "0.5em"
})

export const TextArea = styled.textarea({
	backgroundColor: "var(--background-color)",
	color: "var(--border-unfocused)",
	outline: "none",
	border: "var(--foreground-color) 1px solid",
	padding: "1ex",
	fontSize: "inherit",
	fontWeight: "inherit",
	fontFamily: "inherit",
	margin: "0",
	flexGrow: "11",
	resize: "none",
	":hover": {
		outline: "var(--foreground-color) 1px solid",
	},
	"&:focus": {
		outline: "var(--foreground-color) 1px solid",
		color: "var(--foreground-color)",
	}
})

export const Button = styled.button({
	backgroundColor: "var(--background-color)",
	color: "var(--foreground-color)",
	border: "var(--foreground-color) 1px solid",
	padding: "1ex 1em",
	margin: "0",
	flexGrow: "1",
	":focus, :hover": {
		outline: "var(--foreground-color) 1px solid",
		cursor: "pointer",
	}
})
