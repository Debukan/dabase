import React from 'react';
import { Box, Flex, Button, Heading, HStack, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast({
      title: 'Выход',
      description: 'Вы вышли из системы',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Box bg="gray.100" px={4} py={2}>
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <Heading size="md" as={RouterLink} to="/">
          DaBase
        </Heading>
        
        <HStack spacing={4}>
          <Button as={RouterLink} to="/tasks/kompege" colorScheme="teal" variant="ghost">
            КЕГЭ
          </Button>
          <Button as={RouterLink} to="/tasks/polykov" colorScheme="teal" variant="ghost">
            Поляков
          </Button>
          
          {token ? (
            <>
              <Button as={RouterLink} to="/admin" colorScheme="blue">
                Админ панель
              </Button>
              <Button onClick={handleLogout} colorScheme="red" variant="outline">
                Выйти
              </Button>
            </>
          ) : (
            <Button as={RouterLink} to="/login" colorScheme="blue">
              Войти
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;