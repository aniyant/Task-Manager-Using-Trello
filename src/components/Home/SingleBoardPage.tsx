import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Heading,
    VStack,
    Input,
    Button,
    HStack,
    Text,
    IconButton,
    Flex,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { getBoard, getLists, createList,updateCard,updateList, deleteList, createCard, deleteCard } from '../Services/trelloApi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
    id: string;
    name: string;
    desc: string;
    idList: string;
}

interface List {
    id: string;
    name: string;
    cards: Task[];
}

const SingleBoardPage: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<any>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [countList, setCountList] = useState<number>(0);
    const [newListName, setNewListName] = useState<string>('');
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newTaskDesc, setNewTaskDesc] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        const fetchBoardData = async () => {
            if (boardId) {
                try {
                    const boardData = await getBoard(boardId);
                    const listsData = await getLists(boardId);
                    setBoard(boardData);
                    setLists(listsData);
                    setCountList(lists.length);
                } catch (error) {
                    setError('Failed to fetch board data. Please try again.');
                }
            }
        };
    
        fetchBoardData();
    }, [boardId,countList]);

    const handleAddList = async () => {
        if (!newListName) {
            setError('List name cannot be empty.');
            return;
        }
    
        try {
            if (boardId) {
                await createList(boardId, newListName);
                setCountList(prev =>prev+1); // Update the lists state with the new list
                // console.log(newList);
                setNewListName('');
            }
        } catch (error) {
            setError('Failed to create list. Please try again.');
        }
    };
    

    const handleDeleteList = async (listId: string) => {
        try {
            await deleteList(listId);
            setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
        } catch (error) {
            setError('Failed to delete list. Please try again.');
        }
    };

    const handleAddTask = async (listId: string) => {
        if (!newTaskName || !newTaskDesc) {
            setError('Task name and description cannot be empty.');
            return;
        }

        try {
            const newCard = await createCard(listId, newTaskName, newTaskDesc);
            setLists((prevLists) => prevLists.map((list) => 
                list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
            ));
            setNewTaskName('');
            setNewTaskDesc('');
        } catch (error) {
            setError('Failed to create task. Please try again.');
        }
    };

    const handleDeleteTask = async (listId: string, taskId: string) => {
        try {
            await deleteCard(taskId);
            setLists((prevLists) => prevLists.map((list) => 
                list.id === listId ? { ...list, cards: list.cards.filter((task) => task.id !== taskId) } : list
            ));
        } catch (error) {
            setError('Failed to delete task. Please try again.');
        }
    };

    const handleDragEnd = async (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
    
        // Reorder within the same list
        if (source.droppableId === destination.droppableId) {
            const listIndex = lists.findIndex((list) => list.id === source.droppableId);
            if (listIndex === -1) return;
    
            const newLists = [...lists];
            const list = newLists[listIndex];
            const newCards = Array.from(list.cards);
            const [removed] = newCards.splice(source.index, 1);
            newCards.splice(destination.index, 0, removed);
            list.cards = newCards;
            newLists[listIndex] = list;
    
            setLists(newLists);
            return;
        }
    
        // Moving from one list to another
        const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
        const destListIndex = lists.findIndex((list) => list.id === destination.droppableId);
    
        if (sourceListIndex === -1 || destListIndex === -1) return;
    
        try {
            await updateCard(draggableId, destination.droppableId);
            const newLists = [...lists];
            const sourceList = newLists[sourceListIndex];
            const destList = newLists[destListIndex];
            const newSourceCards = Array.from(sourceList.cards);
            const newDestCards = Array.from(destList.cards);
            const [removed] = newSourceCards.splice(source.index, 1);
            newDestCards.splice(destination.index, 0, removed);
            sourceList.cards = newSourceCards;
            destList.cards = newDestCards;
            newLists[sourceListIndex] = sourceList;
            newLists[destListIndex] = destList;
    
            setLists(newLists);
        } catch (error) {
            setError('Failed to move task. Please try again.');
        }
    };

    return (
        <Box p={5}>
            <VStack spacing={5} align="stretch">
                {/* Board name and add list input */}
                <Heading as="h1" size="xl" mb={5} color="GrayText" textAlign="center">{board?.name}</Heading>
                <HStack spacing={3} width={900} mx="auto">
                    <Input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="New List Name"
                    />
                    <Button onClick={handleAddList} colorScheme="teal">Add List</Button>
                </HStack>

                {/* Error message */}
                {error && <Box color="red.500">{error}</Box>}

                {/* Lists and tasks */}
                <Flex justifyContent="space-around" _horizontal="true" gap={10}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {lists.map((list) => (
                            <Box key={list.id} p={5} shadow="md" borderWidth="1px" w="300px">
                                {list.name}
                                <Heading as="h3" size="md" mb={3}>
                                    <Input
                                        value={list.name}
                                        onBlur={() => updateList(list.id, list.name)}
                                        onChange={(e) => setLists(prevLists => prevLists.map((l) =>
                                            l.id === list.id ? { ...l, name: e.target.value } : l
                                        ))}
                                    />
                                    <IconButton
                                        m={2}
                                        aria-label="Delete list"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        onClick={() => handleDeleteList(list.id)}
                                        ml={2}
                                    />
                                </Heading>
                                
                                {/* Tasks */}
                                <Droppable droppableId={list.id}>
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                                            {list.cards.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            p={3}
                                                            shadow="md"
                                                            borderWidth="1px"
                                                            mb={3}
                                                        >
                                                            {/* Task details */}
                                                            <Text fontSize="lg" mb={2}>{task.name}</Text>
                                                            <Text fontSize="sm" mb={2}>{task.desc}</Text>
                                                            {/* Edit and delete buttons */}
                                                            <HStack spacing={2}>
                                                                <IconButton
                                                                    m={2}
                                                                    aria-label="Edit task"
                                                                    icon={<EditIcon />}
                                                                    size="sm"
                                                                    onClick={() => console.log('Edit task', task.id)}
                                                                />
                                                                <IconButton
                                                                    m={2}
                                                                    aria-label="Delete task"
                                                                    icon={<DeleteIcon />}
                                                                    size="sm"
                                                                    onClick={() => handleDeleteTask(list.id, task.id)}
                                                                />
                                                            </HStack>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>

                                {/* Add task input */}
                                <HStack spacing={3} mt={3}>
                                    <Input
                                        type="text"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                        placeholder="New Task"
                                    />
                                    <Input
                                        type="text"
                                        value={newTaskDesc}
                                        onChange={(e) => setNewTaskDesc(e.target.value)}
                                        placeholder="Description"
                                    />
                                    <IconButton
                                        m={2}
                                        aria-label="Add task"
                                        icon={<AddIcon />}
                                        size="sm"
                                        onClick={() => handleAddTask(list.id)}
                                    />
                                </HStack>
                            </Box>
                        ))}
                    </DragDropContext>
                </Flex>
            </VStack>
        </Box>
    );
};

export default SingleBoardPage;

