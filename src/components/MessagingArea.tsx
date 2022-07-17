import { css } from "@emotion/react"
import styled from "@emotion/styled"
import React, { useRef, useState } from "react"

const Root = styled.div({
	marginTop: "1.5em",
	marginLeft: "0.5em",
	borderTop: "var(--foreground-color) 1px dashed",
	paddingTop: "2em",
})

const Label = styled.label({
	display: "flex",
	gap: "0.5em"
})

const TextArea = styled.textarea({
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

const Button = styled.button({
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
