import { Button, Divider, Flex } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import './CustomQuill.css';

export default function MessageDecorator() {
    const [userMessage, setUserMessage] = useState("");
    const [decoratedMessage, setDecoratedMessage] = useState("");
    const [decorated, setDecorated] = useState(false);
    const [isDecorationRunning, setIsDecorationRunning] = useState(false);

    function onUserMessageChange(newValue: string) {
        setUserMessage(newValue);
    };

    async function onPressDecorate() {
        setIsDecorationRunning(true);
        try {
            const response = await fetch("api/decoratemessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
                mode: "cors",
            });
            setIsDecorationRunning(false);

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setDecoratedMessage(data.message);
            setDecorated(true);
        } catch (e) {
            console.error(e);
            setIsDecorationRunning(false);
        }
    };

    const toolbarOptions = ['bold', 'italic'];
    const formats = ['bold', 'italic', 'link'];


    return (
        <Flex align="start" justify="space-between" gap="middle" style={{ height: "100%", width: "100%" }}>
            <Flex vertical style={{ height: "100%", width: "100%" }} gap="small">
                <ReactQuill
                    style={{
                        height: "90%"
                    }}
                    theme="bubble"
                    value={userMessage}
                    onChange={onUserMessageChange}
                    placeholder="Paste or type your message here..."
                    formats={formats}
                    modules={{
                        toolbar: toolbarOptions
                    }}
                />
                <Button type="primary" size="small" onClick={onPressDecorate} disabled={isDecorationRunning} loading={isDecorationRunning}>Decorate</Button>
            </Flex>
            <ReactQuill
                style={{ height: "100%", width: "100%" }}
                readOnly={!decorated}
                theme="bubble"
                value={decoratedMessage}
                formats={toolbarOptions}
                placeholder="Decorated message will appear here."
            />
        </Flex>


    );
}