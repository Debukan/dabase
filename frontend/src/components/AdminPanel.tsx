import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

const API_BASE_URL = 'http://localhost:8000'; // Измените на ваш реальный базовый URL API

const AdminPanel: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    taskNumber: '',
    site: 'kompege',
    text: '',
    topic: '',
    solution: '',
    explanation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          taskNumber: formData.taskNumber,
          site: formData.site,
          text: formData.text,
          topic: formData.topic,
          solution: formData.solution,
          explanation: formData.explanation || null
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при добавлении задания');
      }

      toast({
        title: 'Успешно',
        description: 'Задание добавлено',
        status: 'success',
        duration: 3000,
      });
      
      setFormData({
        taskNumber: '',
        site: 'kompege',
        text: '',
        topic: '',
        solution: '',
        explanation: ''
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Ошибка сервера',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8} px={4}>
      <Heading mb={6}>Добавление нового решения</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Номер задания</FormLabel>
            <Input
              value={formData.taskNumber}
              onChange={(e) => setFormData({...formData, taskNumber: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Сайт</FormLabel>
            <Select
              value={formData.site}
              onChange={(e) => setFormData({...formData, site: e.target.value})}
            >
              <option value="kompege">КЕГЭ</option>
              <option value="polykov">Поляков</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Тема</FormLabel>
            <Input
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Текст задания</FormLabel>
            <Textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              minHeight="150px"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Решение</FormLabel>
            <Textarea
              value={formData.solution}
              onChange={(e) => setFormData({...formData, solution: e.target.value})}
              minHeight="200px"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Пояснение</FormLabel>
            <Textarea
              value={formData.explanation}
              onChange={(e) => setFormData({...formData, explanation: e.target.value})}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Добавить задание
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminPanel;