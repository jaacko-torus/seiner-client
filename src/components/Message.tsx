import { css } from "@emotion/react";
import styled from "@emotion/styled"
import React, { useEffect, useRef } from "react";

const Root = styled.div({
	marginTop: "0.3em",
	marginBottom: "0.2em",
	padding: "0.5em",
	":hover": {
		backgroundColor: "var(--background-color-focus)",
	},
})

const MessageHead = styled.div({
	userSelect: "none",
	"::selection": {
		background: "transparent",
	},
})

const Heading = styled.span({
	fontWeight: "var(--font-weight-light)",
})

const P = styled.p({
	margin: 0,
	paddingTop: "0.5em",
})

const MessageBody = styled.div({
	paddingLeft: "1em",
})

interface Args { username: string, timestamp: string, messages: string[] }
const Message = ({ username, timestamp, messages }: Args) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => ref.current?.scrollIntoView(), []);
	
	return (
		<Root ref={ref}>
			<MessageHead>
				<Heading>{username}</Heading> @ <Heading>{timestamp}</Heading>
			</MessageHead>
			<MessageBody>
				{messages.map(message => <P>{message}</P>)}
			</MessageBody>
		</Root>
	)
}

export default Message
