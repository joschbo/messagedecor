import { Button, Flex, notification, Tooltip } from "antd";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css';
import './MessageDecorator.css';
import { validateMessage } from "../../../common/MessageValidator";

export default function MessageDecorator() {
    const [userMessage, setUserMessage] = useState("");
    const [decoratedMessage, setDecoratedMessage] = useState("");
    const [decorated, setDecorated] = useState(false);
    const [isDecorationRunning, setIsDecorationRunning] = useState(false);
    const [validationErrors, setValidationErrors] = useState(validateMessage(""));

    const decoratedMessageQuillRef = useRef(null);

    function onUserMessageChange(newValue: string) {
        setUserMessage(newValue);
        setValidationErrors(validateMessage(newValue));
    };


    function hasParentWithClass(element: Element, className: string) {
        return element.closest('.' + className) !== null;
    }

    function onCopy(event: React.ClipboardEvent) {
        if(!hasParentWithClass(event.target as Element, 'decorated-message-quill') || !decoratedMessageQuillRef.current) {
            return;
        }
        // Get the copied content
        let selectedText = decoratedMessageQuillRef.current.editor.root.innerHTML;

        // Check if selected text contains HTML tags and convert them
        let formattedText = selectedText.replace(/<strong>(.*?)<\/strong>/g, '**$1**')  // Convert <b> to **
            .replace(/<i>(.*?)<\/i>/g, '__$1__')
            .replace(/<p><br><\/p>/g, '\n\n') // Convert <p><br><p> to \n\n
            .replace(/<[^>]*>/g, '');; // Convert <i> to __

        // Set the modified text into the clipboard
        event.clipboardData.setData('text/plain', formattedText);
        event.preventDefault(); // Prevent default copy behavior
    }

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
            notification.error({
                message: "An error occurred",
                description: "Please try again later."
            });
            console.log(e);
            setIsDecorationRunning(false);
        }
    };

    const toolbarOptions = ['bold', 'italic'];
    const formats = ['bold', 'italic', 'link'];


    return (
        <Flex className="message-decorator-container" align="start" justify="space-between" gap="middle" style={{ flexGrow: 1, width: "100%" }} onCopy={onCopy}>
            <Flex vertical style={{ flexGrow: 1, width: "100%" }} gap="small" >
                <ReactQuill
                    className="user-message-quill"
                    theme="bubble"
                    value={userMessage}
                    onChange={onUserMessageChange}
                    placeholder="Paste or type your message here..."
                    formats={formats}
                    modules={{
                        toolbar: toolbarOptions
                    }}
                />
                <Tooltip title={validationErrors[0]}>
                    <Button type="primary" size="middle" onClick={onPressDecorate} disabled={isDecorationRunning || validationErrors.length > 0} loading={isDecorationRunning}>Decorate</Button>
                </Tooltip>
            </Flex>
            <ReactQuill
                className="decorated-message-quill"
                ref={decoratedMessageQuillRef as any}
                style={{ minHeight: "20rem", width: "100%" }}
                readOnly={!decorated}
                theme="bubble"
                value={decoratedMessage}
                formats={toolbarOptions}
                modules={{
                    toolbar: toolbarOptions
                }}
                placeholder="Decorated message will appear here."
            />
        </Flex>
    );
}