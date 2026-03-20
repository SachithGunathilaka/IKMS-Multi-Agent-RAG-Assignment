import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const MessageInput = ({ handleAddMessage, handleSetMessages }) => {

    const [input, setInput] = useState("");


    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = async () => {
        handleAddMessage({ role: "user", content: input });
        setInput("");
        try {
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            console.log("Response:", data)
            handleAddMessage({ role: "assistant", content: data.message });
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    }


    return (
        <div className="mt-10">
            <Textarea value={input} onChange={handleInputChange} className="w-full" placeholder="What is on your mind?" />
            <div className="mt-4 flex gap-x-2">
                <Button type="button" onClick={handleSubmit}>Send</Button>
            </div>
        </div>)
}

export default MessageInput;