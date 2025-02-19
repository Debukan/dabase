import React from 'react';
import { Box, Flex, Button, Heading, HStack, useColorMode, IconButton, useToast } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} px={4} py={2}>
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <Heading size="md" as={RouterLink} to="/">
          DaBase
        </Heading>
        
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="md"
            variant="ghost"
          />
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