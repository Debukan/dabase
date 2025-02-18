import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Divider, VStack, Badge } from '@chakra-ui/react';
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
                    <Text whiteSpace="pre-wrap">{task.description}</Text>
                </Box>

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
                    <Text color="gray.500" fontSize="sm">
                        Добавлено: {new Date(task.created_at).toLocaleDateString()}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default TaskPage;
