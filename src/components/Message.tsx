import React from "react";

export interface Args { username: string, timestamp: string, body: string }
const Message = ({username, timestamp, body}: Args) => (
	<div className="message">
		<div className="message_head">
			<span className="message_username">{username}</span> @ <span className="message_timestamp">{timestamp}</span>
		</div>
		<div className="message_body">
			<p>{body}</p>
		</div>
	</div>
)

export default Message
