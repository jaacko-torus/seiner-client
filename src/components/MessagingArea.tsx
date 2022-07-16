import React from "react";

export interface Args { messagingDataRef: React.RefObject<HTMLTextAreaElement> }
const MessagingArea = ({messagingDataRef}: Args) => (
	<div id="messaging_area">
		<label>
			<textarea
				ref={messagingDataRef}
				id="messaging_data"
				minLength={1}
				maxLength={200}
				placeholder="Type a message"
				wrap="soft"
			></textarea>
			<button id="messaging_button">Send</button>
		</label>
	</div>
)

export default MessagingArea
