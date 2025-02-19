import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Divider, VStack, Badge, Image, Button, HStack, useToast, IconButton, Flex, FormControl, FormLabel, Textarea, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Task } from '../types';
import { CopyIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const TaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`);
                if (!response.ok) {
                    throw new Error('Задание не найдено');
                }
                const data = await response.json();
                setTask(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Произошла ошибка');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/verify-token', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setIsAdmin(response.ok);
                } catch (error) {
                    setIsAdmin(false);
                }
            }
        };
        checkAdmin();
    }, []);

    const handleEdit = () => {
        setEditedTask(task);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editedTask) return;
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editedTask)
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTask(updatedTask);
                setIsEditing(false);
                toast({
                    title: "Успешно",
                    description: "Изменения сохранены",
                    status: "success",
                    duration: 2000,
                });
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось сохранить изменения",
                status: "error",
                duration: 2000,
            });
        }
    };

    const handleDownloadSolution = () => {
        if (task?.solution_file && task?.solution_filename) {
            const linkSource = `data:application/octet-stream;base64,${task.solution_file}`;
            const downloadLink = document.createElement('a');
            downloadLink.href = linkSource;
            downloadLink.download = task.solution_filename;
            downloadLink.click();
        }
    };

    const handleCopySolution = () => {
        if (task?.solution) {
            navigator.clipboard.writeText(task.solution)
                .then(() => {
                    toast({
                        title: "Скопировано!",
                        description: "Решение скопировано в буфер обмена",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                })
                .catch(err => {
                    toast({
                        title: "Ошибка",
                        description: "Не удалось скопировать решение",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    });
                });
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                toast({
                    title: "Успешно",
                    description: "Задание удалено",
                    status: "success",
                    duration: 2000,
                });
                navigate(-1);
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось удалить задание",
                status: "error",
                duration: 2000,
            });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (isLoading) {
        return <Box p={8}>Загрузка...</Box>;
    }

    if (error || !task) {
        return <Box p={8}>Ошибка: {error}</Box>;
    }

    if (isEditing && editedTask) {
        return (
            <Box maxW="container.lg" mx="auto" p={8}>
                <VStack spacing={6} align="stretch">
                    <FormControl>
                        <FormLabel>Текст задания</FormLabel>
                        <Textarea
                            value={editedTask.text}
                            onChange={(e) => setEditedTask({...editedTask, text: e.target.value})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Решение</FormLabel>
                        <Textarea
                            value={editedTask.solution}
                            onChange={(e) => setEditedTask({...editedTask, solution: e.target.value})}
                            minH="200px"
                            fontFamily="monospace"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Пояснение</FormLabel>
                        <Textarea
                            value={editedTask.explanation || ''}
                            onChange={(e) => setEditedTask({...editedTask, explanation: e.target.value})}
                        />
                    </FormControl>
                    <HStack spacing={4}>
                        <Button colorScheme="blue" onClick={handleSave}>Сохранить</Button>
                        <Button onClick={() => setIsEditing(false)}>Отмена</Button>
                    </HStack>
                </VStack>
            </Box>
        );
    }

    return (
        <Box maxW="container.lg" mx="auto" p={8}>
            <VStack align="stretch" spacing={6}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Heading size="lg">{task.title}</Heading>
                        <Badge colorScheme="blue" mt={2}>{task.topic}</Badge>
                    </Box>
                    {isAdmin && (
                        <HStack>
                            <IconButton
                                aria-label="Edit task"
                                icon={<EditIcon />}
                                onClick={handleEdit}
                                colorScheme="blue"
                            />
                            <IconButton
                                aria-label="Delete task"
                                icon={<DeleteIcon />}
                                onClick={() => setIsDeleteDialogOpen(true)}
                                colorScheme="red"
                            />
                        </HStack>
                    )}
                </Flex>

                <Divider />

                <Box>
                    <Heading size="md" mb={4}>Текст задания:</Heading>
                    <Text whiteSpace="pre-wrap">{task.text}</Text>
                </Box>

                <Box>
                    <Heading size="md" mb={4}>Решение:</Heading>
                    <Box position="relative">
                        <IconButton
                            aria-label="Копировать решение"
                            icon={<CopyIcon />}
                            onClick={handleCopySolution}
                            position="absolute"
                            right="2"
                            top="2"
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            _hover={{
                                bg: 'rgba(0, 0, 0, 0.1)'
                            }}
                            zIndex="1"
                        />
                        <Box borderRadius="md" overflow="hidden">
                            <SyntaxHighlighter
                                language="python"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                    paddingRight: '40px'
                                }}
                            >
                                {task.solution}
                            </SyntaxHighlighter>
                        </Box>
                    </Box>
                </Box>

                {task.image_data && task.image_type && (
                    <Box>
                        <Image
                            src={`data:${task.image_type};base64,${task.image_data}`}
                            alt="Task image"
                            maxW="100%"
                        />
                    </Box>
                )}

                {task.solution_file && task.solution_filename && (
                    <Box>
                        <Button onClick={handleDownloadSolution} colorScheme="blue">
                            Скачать файл решения: {task.solution_filename}
                        </Button>
                    </Box>
                )}

                {task.explanation && task.explanation.trim() !== '' && (
                    <>
                        <Divider />
                        <Box>
                            <Heading size="md" mb={4}>Пояснение:</Heading>
                            <Text whiteSpace="pre-wrap">{task.explanation}</Text>
                        </Box>
                    </>
                )}

                <Box>
                    <Text color="gray.500" fontSize="sm">
                        Источник: {task.source}, Номер задания: {task.task_number}
                    </Text>
                    {task.task_url && (
                        <Text color="blue.500" fontSize="sm" as="a" href={task.task_url} target="_blank">
                            Ссылка на оригинал задания
                        </Text>
                    )}
                    <Text color="gray.500" fontSize="sm">
                        Добавлено: {new Date(task.created_at).toLocaleDateString()}
                    </Text>
                </Box>
            </VStack>

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Удалить задание
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Вы уверены? Это действие нельзя отменить.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                Отмена
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Удалить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default TaskPage;
