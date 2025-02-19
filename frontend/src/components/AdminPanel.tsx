import React, { useState, useRef } from 'react';
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
  useColorModeValue,
  Image,
  Text,
} from '@chakra-ui/react';
import { AVAILABLE_TOPICS } from '../constants/topics';

const API_BASE_URL = 'http://localhost:8000';

const AdminPanel: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const solutionFileInputRef = useRef<HTMLInputElement>(null);
  const [solutionFileName, setSolutionFileName] = useState<string>('');
  const [formData, setFormData] = useState({
    taskNumber: '',
    site: 'kompege',
    text: '',
    topic: '1',
    solution: '',
    explanation: '',
    task_url: '',
    image_data: '',
    image_type: '',
    solution_file: '',
    solution_filename: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setFormData({
          ...formData,
          image_data: base64.split(',')[1],
          image_type: file.type
        });
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolutionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) { // 5MB limit
        toast({
          title: 'Ошибка',
          description: 'Файл слишком большой. Максимальный размер: 5MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData({
            ...formData,
            solution_file: reader.result,
            solution_filename: file.name
          });
          setSolutionFileName(file.name);
        }
      };
      reader.onerror = () => {
        toast({
          title: 'Ошибка',
          description: 'Не удалось прочитать файл',
          status: 'error',
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestBody = {
        taskNumber: formData.taskNumber,
        site: formData.site,
        text: formData.text,
        topic: formData.topic,
        solution: formData.solution,
        explanation: formData.explanation || null,
        task_url: formData.task_url || null,
        image_data: formData.image_data || null,
        image_type: formData.image_type || null,
        solution_file: formData.solution_file || null,
        solution_filename: formData.solution_filename || null
      };

      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
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
        topic: '1',
        solution: '',
        explanation: '',
        task_url: '',
        image_data: '',
        image_type: '',
        solution_file: '',
        solution_filename: ''
      });
      setPreviewImage(null);
      setSolutionFileName('');
    } catch (error) {
      console.error('Error submitting form:', error);
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
            <Select
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
            >
              {AVAILABLE_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </Select>
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
              fontFamily="monospace"
              spellCheck="false"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Пояснение</FormLabel>
            <Textarea
              value={formData.explanation}
              onChange={(e) => setFormData({...formData, explanation: e.target.value})}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Ссылка на задание</FormLabel>
            <Input
              value={formData.task_url}
              onChange={(e) => setFormData({...formData, task_url: e.target.value})}
              placeholder="https://..."
            />
          </FormControl>

          <FormControl>
            <FormLabel>Изображение</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </FormControl>

          {previewImage && (
            <Box>
              <Image
                src={previewImage}
                alt="Preview"
                maxH="300px"
                onError={() => setPreviewImage(null)}
              />
            </Box>
          )}

          <FormControl>
            <FormLabel>Файл решения</FormLabel>
            <Input
              type="file"
              onChange={handleSolutionFileUpload}
              ref={solutionFileInputRef}
              accept=".py,.cpp,.txt"
            />
            {solutionFileName && (
              <Text mt={2} fontSize="sm" color="gray.600">
                Выбран файл: {solutionFileName}
              </Text>
            )}
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