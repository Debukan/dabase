import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Input } from '@chakra-ui/react';
import TaskList from '../components/TaskList';
import { Task } from '../types';

const TasksPage: React.FC = () => {
    const { site } = useParams<{ site: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/tasks/?source=${site}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [site]);

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box maxW="container.xl" mx="auto" py={8} px={4}>
            <Heading mb={4}>Задания - {site}</Heading>
            <Input 
                placeholder="Поиск заданий..." 
                mb={4}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <TaskList tasks={filteredTasks} />
        </Box>
    );
};

export default TasksPage;