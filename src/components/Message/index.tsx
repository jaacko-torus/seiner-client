import { useEffect, useRef } from "react"
import { Root, Heading, MessageBody, MessageHead, P } from "./styled"

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
