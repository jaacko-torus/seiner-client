import React, { useState } from "react";

export interface Args { messagingDataRef: React.RefObject<HTMLTextAreaElement>, sendData: (data: string) => void }
const MessagingArea = ({messagingDataRef, sendData}: Args) => {
	const [value, setValue] = useState("")
	
	const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter") {
			setValue(prev => prev.slice(0, Math.max(prev.length - 2, 0)))
			
			if (document.activeElement === messagingDataRef.current) {
				const trimmed_value = value.trim()
				
				if (trimmed_value.length !== 0) sendData(trimmed_value)
				
				setValue("")
			}
		}

		if (e.key === "Escape") {
			messagingDataRef.current?.blur()
		}

		// what is this true about?
		return true
	}
	
	return (<div id="messaging_area">
		<label>
			<textarea
				ref={messagingDataRef}
				id="messaging_data"
				minLength={1}
				maxLength={200}
				placeholder="Type a message"
				wrap="soft"
				value={value}
				onKeyDown={onKeyDown}
				onChange={e => setValue(e.target.value ?? "")}
			></textarea>
			<button id="messaging_button">Send</button>
		</label>
	</div>)
}

export default MessagingArea
