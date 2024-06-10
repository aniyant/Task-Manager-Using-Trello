import React from 'react';
import {
    Box,
    Heading,
    Spinner,
    VStack,
    IconButton,
    Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';

interface Board {
    id: string;
    name: string;
}

interface BoardsListProps {
    boards: Board[];
    loading: boolean;
    onDelete: (boardId: string) => void; // Add onDelete prop
}

const BoardsList: React.FC<BoardsListProps> = ({ boards, loading, onDelete }) => {
    const navigate = useNavigate();

    const handleBoardClick = (boardId: string) => {
        navigate(`/board/${boardId}`);
    };

    const handleDeleteBoard = (boardId: string) => {
        onDelete(boardId); // Call onDelete function when delete button is clicked
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={5}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <VStack spacing={6} align="stretch" mt={5}>
            <Heading as="h2" size="lg" color='teal'>Your Boards</Heading>
            <Flex gap={4} justifyContent="left" flexWrap="wrap">
                {boards.map((board) => (
                    <Box key={board.id}>
                        <Box p={5} shadow="md" borderWidth="1px" cursor="pointer" display="flex" justifyContent="space-between" alignItems="center">
                            <Box onClick={() => handleBoardClick(board.id)} flex="1">
                                <Heading fontSize="xl" color="green">{board.name}</Heading>
                            </Box>
                            <IconButton
                                aria-label="Delete board"
                                icon={<DeleteIcon />}
                                mx={5}
                                size="sm"
                                onClick={() => handleDeleteBoard(board.id)}
                            />
                        </Box>
                    </Box>
                ))}
            </Flex>
        </VStack>
    );
};

export default BoardsList;
