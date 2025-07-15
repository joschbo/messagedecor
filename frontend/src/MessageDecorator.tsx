import { Box, Button, Card, Center, Container, em, Group, LoadingOverlay, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import './MessageDecorator.css';
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { validateMessage } from "../../common/MessageValidator";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

export default function MessageDecorator() {
    const [userMessage, setUserMessage] = useState("");
    const [decoratedMessage, setDecoratedMessage] = useState("");
    const [isDecorated, setDecorated] = useState(false);
    const [isDecorationRunning, setIsDecorationRunning] = useState(false);
    const [validationErrors, setValidationErrors] = useState(validateMessage(""));
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const userMessageEditor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Paste or type your message here...'
            }),
        ],
        onUpdate: ({ editor }) => {
            const errors = validateMessage(editor.getText());
            setValidationErrors(errors);
            setUserMessage(editor.getHTML());
        },
        content: userMessage
    });
    const decoratedMessageEditor = useEditor({
        extensions: [
            StarterKit,
        ],
        editable: false,
    });

    useEffect(() => {
        if (!decoratedMessageEditor) return;
        // If the decorated message editor is not initialized, do nothing

        if (!isDecorated) {
            // If the message is not decorated, set the content to a placeholder
            decoratedMessageEditor.commands.setContent('<p>Decorated message will appear here...</p>');
            return;
        }
        // If the message is decorated, set the content to the decorated message
        if (decoratedMessageEditor.getHTML() !== decoratedMessage) {
            decoratedMessageEditor.commands.setContent(decoratedMessage);
        }
    }, [decoratedMessage, decoratedMessageEditor]);


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
            notifications.show({
                color: "red",
                message: "An error occurred",
                title: "Error",
                autoClose: 3000,
                withCloseButton: true,
                icon: "⚠️",
            });
            console.log(e);
            setIsDecorationRunning(false);
        }
    };

    function onCopyDecoratedMessage(event: any) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return '';

        const range = selection.getRangeAt(0);
        const clonedContent = range.cloneContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(clonedContent);
        const textToCopy = tempDiv.innerHTML;
        let formattedText = textToCopy.replace(/<strong>(.*?)<\/strong>/g, '*$1*')  // Convert <b> to **
            .replace(/<i>(.*?)<\/i>/g, '_$1_')// Convert <i> to __
            .replace(/<p>(.*?)<\/p>/g, '$1\n') // Convert <p><br><p> to \n\n
            .replace(/<[^>]*>/g, '')
            .replace(/\n$/, ""); // Remove trailing newline; 

        // Set the modified text into the clipboard
        event.preventDefault(); // Prevent default copy behavior
        event.clipboardData.setData('text/plain', formattedText);
    }


    return (
        <Box h="100vh" bg="gray.1" w="100vw">
            <Center h="100%" w="100%">
                <Container w="100%" maw="1000px">
                    <Card shadow="md" padding="xl" radius="md" withBorder>
                        <Stack gap="md">
                            <Stack ta="center" gap="0">
                                <Title order={2}>
                                    Message Decorator
                                </Title>
                                <Text c="dimmed" fz="sm">
                                    Make your WhatsApp, Telegram, or Signal messages more readable and polished—instantly.
                                </Text>
                            </Stack>

                            <Group grow gap="md" mt="xs">
                                {/** Display only one RichTextEditor at a time on mobile devices. */}
                                {(!isMobile || !isDecorated) && (
                                    <Box pos="relative" w="100%">
                                        <LoadingOverlay visible={isDecorationRunning} h="100%" w="100%" hiddenFrom="md" />
                                        <RichTextEditor editor={userMessageEditor} h="300px" hidden={isMobile && isDecorated}>
                                            <RichTextEditor.Content className="message-decorator-editor-content" />
                                        </RichTextEditor>
                                    </Box>)}
                                {/** Display only one RichTextEditor at a time on mobile devices. */}
                                {(!isMobile || isDecorated) && (
                                    <Box pos="relative" w="100%">
                                        <LoadingOverlay visible={isDecorationRunning} h="100%" w="100%" visibleFrom="md" />
                                        <RichTextEditor
                                            editor={decoratedMessageEditor}
                                            h="300px"
                                            onCopy={onCopyDecoratedMessage}                                      >
                                            <RichTextEditor.Content className={`message-decorator-editor-content${isDecorated ? '' : ` normal-text-placeholder`}`} />
                                        </RichTextEditor>
                                    </Box>
                                )}
                            </Group>
                            <Box>
                                {/** Show Decorate button not on mobile when already decorated and result is shown */}
                                {(!isMobile || !isDecorated) && (<Button
                                    onClick={onPressDecorate}
                                    disabled={validationErrors.length > 0}
                                    loading={isDecorationRunning}
                                    variant="filled"
                                    w="100%"
                                    autoFocus
                                >
                                    Decorate
                                </Button>
                                )}
                                {/** Show Clear button on mobile when already decorated and result is shown */}
                                {isMobile && isDecorated && (
                                    <Button onClick={() => setDecorated(false)} variant="default" w="100%">
                                        Back
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Card>
                </Container>
            </Center>
            
            <footer style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <Text ta="center" c="dimmed" fz="xs" p="md">
                    Made with ❤️ by <a href="https://joschabohn.de" target="_blank" rel="noopener noreferrer">Joscha Bohn</a>
                </Text>
            </footer>
        </Box>
    );
}