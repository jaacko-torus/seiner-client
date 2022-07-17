import React, { useRef, useState } from "react";

export interface Args { sendData: (data: string) => void }
const MessagingArea = ({ sendData }: Args) => {
	const [value, setValue] = useState("")

	const ref = useRef<HTMLTextAreaElement>(null)

	const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && document.activeElement === ref.current) {
			e.preventDefault()
			
			const trimmed_value = value.trim()

			if (trimmed_value.length !== 0) sendData(trimmed_value)

			setValue(prev => "")
		}

		if (e.key === "Escape") {
			ref.current?.blur()
		}
	}

	return (
		<div id="messaging_area">
			<label>
				<textarea
					ref={ref}
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
		</div>
	)
}

export default MessagingArea
