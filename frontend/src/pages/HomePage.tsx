import React from 'react';
import { Box, Heading, SimpleGrid, Card, CardBody, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box maxW="container.xl" mx="auto" py={8} px={4}>
      <Heading mb={8}>Выберите сайт с заданиями</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Card as={RouterLink} to="/tasks/kompege">
          <CardBody>
            <Heading size="md">КЕГЭ</Heading>
            <Text mt={4}>Задания с сайта kompege.ru</Text>
          </CardBody>
        </Card>
        <Card as={RouterLink} to="/tasks/polykov">
          <CardBody>
            <Heading size="md">Поляков</Heading>
            <Text mt={4}>Задания с сайта kpolyakov.spb.ru</Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;