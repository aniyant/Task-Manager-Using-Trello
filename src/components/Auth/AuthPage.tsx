import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext'; 
import HomePage from '../Home/HomePage';
import {
    Box,
    Button,
    Heading,
    Input,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';

const AuthPage: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const handleLoginClick = () => {
        if (inputUsername === 'admin' && inputPassword === 'admin') {
            login();
        }
    };

    return (
        <Box textAlign="center" mt={10}>
            {isAuthenticated ? (
                <VStack spacing={5}>
                    <HomePage />
                </VStack>
            ) : (
                <VStack spacing={5}>
                    <Heading as="h1" size="xl" mb={5} color="GrayText">
                    Welcome To Trello Task Management
                    </Heading>
                    {/* <Heading color={'GrayText'} width={200}></Heading> */}
                    <Text color="gray.500">
                        Please use username:'admin' and password:'admin'
                    </Text>
                    <Stack spacing={3} width="300px" margin="auto">
                        <Input
                            type="text"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            placeholder="Username"
                            size="md"
                        />
                        <Input
                            type="password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            placeholder="Password"
                            size="md"
                        />
                        <Button onClick={handleLoginClick} colorScheme="teal">
                            Login
                        </Button>
                    </Stack>
                </VStack>
            )}
        </Box>
    );
};

export default AuthPage;
