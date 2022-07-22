import type React from "react"

import { useRef, useState } from "react"
import { Button, Label, Root, TextArea } from "./styled"

export interface Args { sendData: (data: string) => void }
const MessagingArea = ({ sendData }: Args) => {
	const [value, setValue] = useState("")

	const ref = useRef<HTMLTextAreaElement>(null)

	const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && document.activeElement === ref.current) {
			e.preventDefault()
			
			const trimmed_value = value.trim().split("\n")

			if (trimmed_value !== undefined) sendData(JSON.stringify(trimmed_value))

			setValue(prev => "")
		}

		if (e.key === "Escape") {
			ref.current?.blur()
		}
	}

	return (
		<Root>
			<Label>
				<TextArea
					ref={ref}
					minLength={1}
					maxLength={200}
					placeholder="Type a message"
					wrap="soft"
					value={value}
					onKeyDown={onKeyDown}
					onChange={e => setValue(e.target.value ?? "")}
				></TextArea>
				<Button>Send</Button>
			</Label>
		</Root>
	)
}

export default MessagingArea
