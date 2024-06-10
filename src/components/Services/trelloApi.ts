import axios from 'axios';

const API_KEY = '64b95b2b75a26de3e5a4d27fcfe7fa16';
const TOKEN = 'ATTAa28c780800bcf53a231295036186497c9c7273fee0ae90d89908358b26f0aa770727A720';

const trelloApi = axios.create({
    baseURL: 'https://api.trello.com/1',
    params: {
        key: API_KEY,
        token: TOKEN
    }
});

interface CreateBoardResponse {
    id: string;
    name: string;
    url: string;
}

interface Board {
    id: string;
    name: string;
    url: string;
}

interface List {
    id: string;
    name: string;
    cards: Task[];
}

interface Task {
    id: string;
    name: string;
    desc: string;
    idList: string;
}

const handleApiError = (error: unknown): Error => {
    if (axios.isAxiosError(error) && error.response) {
        return new Error(error.response.data.message || error.message);
    }
    return new Error('An unknown error occurred');
};

export const createBoard = async (boardName: string): Promise<CreateBoardResponse> => {
    try {
        const response = await trelloApi.post<CreateBoardResponse>('/boards/', {
            name: boardName,
            defaultLists: false
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteBoard = async (boardId: string): Promise<void> => {
    try {
        await trelloApi.delete(`/boards/${boardId}`);
    } catch (error) {
        throw handleApiError(error);
    }
};


export const getBoards = async (): Promise<Board[]> => {
    try {
        const response = await trelloApi.get<Board[]>('/members/me/boards');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getBoard = async (boardId: string): Promise<Board> => {
    try {
        const response = await trelloApi.get<Board>(`/boards/${boardId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getLists = async (boardId: string): Promise<List[]> => {
    try {
        const response = await trelloApi.get<List[]>(`/boards/${boardId}/lists?cards=all`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const createList = async (boardId: string, listName: string): Promise<List> => {
    try {
        const response = await trelloApi.post<List>('/lists', {
            name: listName,
            idBoard: boardId
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const createCard = async (listId: string, cardName: string, cardDesc: string): Promise<Task> => {
    try {
        const response = await trelloApi.post<Task>('/cards', {
            name: cardName,
            desc: cardDesc,
            idList: listId
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateCard = async (cardId: string, listId: string): Promise<void> => {
    try {
        await trelloApi.put(`/cards/${cardId}`, {
            idList: listId
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteCard = async (cardId: string): Promise<void> => {
    try {
        await trelloApi.delete(`/cards/${cardId}`);
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateList = async (listId: string, listName: string): Promise<void> => {
    try {
        await trelloApi.put(`/lists/${listId}`, { name: listName });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteList = async (listId: string): Promise<void> => {
    try {
        await trelloApi.post(`/lists/${listId}/archiveAllCards`);
        console.log(trelloApi.toString())
    } catch (error) {
        throw handleApiError(error);
    }
};

