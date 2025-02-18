import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Divider, VStack, Badge, Image } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Task } from '../types';

const TaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (isLoading) {
        return <Box p={8}>Загрузка...</Box>;
    }

    if (error || !task) {
        return <Box p={8}>Ошибка: {error}</Box>;
    }

    return (
        <Box maxW="container.lg" mx="auto" p={8}>
            <VStack align="stretch" spacing={6}>
                <Box>
                    <Heading size="lg">{task.title}</Heading>
                    <Badge colorScheme="blue" mt={2}>{task.topic}</Badge>
                </Box>

                <Divider />

                <Box>
                    <Heading size="md" mb={4}>Текст задания:</Heading>
                    <Text whiteSpace="pre-wrap">{task.text}</Text>
                </Box>

                <Box>
                    <Heading size="md" mb={4}>Решение:</Heading>
                    <Box borderRadius="md" overflow="hidden">
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.375rem',
                            }}
                        >
                            {task.description}
                        </SyntaxHighlighter>
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
        </Box>
    );
};

export default TaskPage;
