import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
// import CreateBoard from '..Services/trelloApi';
import BoardsList from './BoardList';
import { createBoard, getBoards,deleteBoard } from '../Services/trelloApi';
import { Box, Heading, Button, VStack, Input, Stack, Alert, AlertIcon } from '@chakra-ui/react';


interface Board {
    id: string;
    name: string;
    url: string;
}

const HomePage: React.FC = () => {
    const { logout } = useAuth();
    const [boards, setBoards] = useState<Board[]>([]);
    const [newBoardName, setNewBoardName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const boardsData = await getBoards();
                setBoards(boardsData);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch boards. Please try again.');
                setLoading(false);
            }
        };

        fetchBoards();
    }, []);

    const handleCreateBoard = async () => {
        if (!newBoardName) {
            setError('Board name cannot be empty.');
            return;
        }

        try {
            setLoading(true);
            const newBoard = await createBoard(newBoardName);
            setBoards((prevBoards) => [...prevBoards, newBoard]);
            setNewBoardName('');
            setLoading(false);
        } catch (error) {
            setError('Failed to create board. Please try again.');
            setLoading(false);
        }
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleDeleteBoard = async (boardId: string) => {
      try {
          setLoading(true);
          await deleteBoard(boardId);
          setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
          setLoading(false);
      } catch (error) {
          setError('Failed to delete board. Please try again.');
          setLoading(false);
      }
  };

    return (
        <Box p={5} width={900}>
            <VStack spacing={5} align="stretch">
                <Heading as="h1" size="xl" mb={5} color="GrayText">
                    Trello Task Management
                    <Button mx={10} onClick={handleLogoutClick} colorScheme="red" alignSelf="flex-end">
                    Logout
                    </Button>
                </Heading>
                <Stack spacing={3} direction="row" align="center">
                    <Input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="New Board Name"
                    />
                    <Button p={5} px={10} onClick={handleCreateBoard} colorScheme="teal" isLoading={loading}>
                        Create New Board
                    </Button>
                </Stack>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <BoardsList boards={boards} loading={loading} onDelete={handleDeleteBoard} />
            </VStack>
        </Box>
    );
};

export default HomePage;
