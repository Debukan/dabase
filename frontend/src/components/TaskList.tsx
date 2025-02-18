import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { VStack, Box, Heading, Text, Badge } from '@chakra-ui/react';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <VStack spacing={4} align="stretch">
            {tasks.map((task) => (
                <Box
                    key={task.id}
                    as={RouterLink}
                    to={`/task/${task.id}`}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    _hover={{ bg: 'gray.50' }}
                >
                    <Heading size="md">{task.title}</Heading>
                    <Badge colorScheme="blue" mt={2}>{task.topic}</Badge>
                    <Text mt={2} noOfLines={2}>{task.description}</Text>
                </Box>
            ))}
        </VStack>
    );
};

export default TaskList;