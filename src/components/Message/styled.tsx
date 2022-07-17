import styled from "@emotion/styled"

export const Root = styled.div({
	marginTop: "0.3em",
	marginBottom: "0.2em",
	padding: "0.5em",
	":hover": {
		backgroundColor: "var(--background-color-focus)",
	},
})

export const MessageHead = styled.div({
	userSelect: "none",
	"::selection": {
		background: "transparent",
	},
})

export const Heading = styled.span({
	fontWeight: "var(--font-weight-light)",
})

export const P = styled.p({
	margin: 0,
	paddingTop: "0.5em",
})

export const MessageBody = styled.div({
	paddingLeft: "1em",
})
