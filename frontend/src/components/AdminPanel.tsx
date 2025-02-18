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
} from '@chakra-ui/react';
import { AVAILABLE_TOPICS } from '../constants/topics';

const API_BASE_URL = 'http://localhost:8000';

const AdminPanel: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    taskNumber: '',
    site: 'kompege',
    text: '',
    topic: '',
    solution: '',
    explanation: '',
    task_url: '',
    image_url: '',
    image_data: '',
    image_type: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({...formData, image_url: url});
    setPreviewImage(url);
  };

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
          explanation: formData.explanation || null,
          task_url: formData.task_url || null,
          image_url: formData.image_url || null,
          image_data: formData.image_data || null,
          image_type: formData.image_type || null
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
        explanation: '',
        task_url: '',
        image_url: '',
        image_data: '',
        image_type: ''
      });
      setPreviewImage(null);
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
            <FormLabel>URL изображения</FormLabel>
            <Input
              value={formData.image_url}
              onChange={handleImageUrlChange}
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

          <Button type="submit" colorScheme="blue" width="full">
            Добавить задание
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminPanel;