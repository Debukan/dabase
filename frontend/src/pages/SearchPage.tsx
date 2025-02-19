import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Input,
    Wrap,
    WrapItem,
    Tag,
    VStack,
} from '@chakra-ui/react';
import TaskList from '../components/TaskList';
import { Task } from '../types';
import { AVAILABLE_TOPICS } from '../constants/topics';

const SearchPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/tasks/');
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const filtered = tasks.filter(task => {
            const matchesSearch = searchTerm === '' ||
                task.task_number.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTopic = !selectedTopic || task.topic === selectedTopic;

            return matchesSearch && matchesTopic;
        });
        setFilteredTasks(filtered);
    }, [searchTerm, selectedTopic, tasks]);

    const handleTopicClick = (topic: string) => {
        setSelectedTopic(selectedTopic === topic ? null : topic);
    };

    return (
        <Box maxW="container.xl" mx="auto" py={8} px={4}>
            <VStack spacing={6} align="stretch">
                <Heading>Поиск задач</Heading>
                
                <Input
                    placeholder="Поиск по номеру задания или ключевым словам..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                />

                <Box>
                    <Heading size="md" mb={4}>Темы:</Heading>
                    <Wrap spacing={2}>
                        {AVAILABLE_TOPICS.map((topic) => (
                            <WrapItem key={topic}>
                                <Tag
                                    size="lg"
                                    variant={selectedTopic === topic ? "solid" : "outline"}
                                    colorScheme="blue"
                                    cursor="pointer"
                                    onClick={() => handleTopicClick(topic)}
                                >
                                    {topic}
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>
                </Box>

                <TaskList tasks={filteredTasks} />
            </VStack>
        </Box>
    );
};

export default SearchPage;