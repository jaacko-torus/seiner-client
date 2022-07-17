import styled from "@emotion/styled"

export const Root = styled.main({
	minHeight: "100%",
	gridArea: "chat",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
})

export const ChatArea = styled.div({
	flexGrow: 1,
	overflowY: "auto",
	overflowWrap: "break-word",
})
