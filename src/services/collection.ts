import api from './api';
import { type Website } from './website';

export interface Collection {
    _id: string;
    name: string;
    websites: Website[]; 
    createdAt: string;
}

// Get all my folders
export const getCollections = async () => {
    const response = await api.get<Collection[]>('/collections');
    return response.data;
};

// Create a new folder
export const createCollection = async (name: string) => {
    const response = await api.post('/collections', { name });
    return response.data;
};

// Add website to folder
export const addToCollection = async (collectionId: string, websiteId: string) => {
    const response = await api.put(`/collections/${collectionId}/add`, { websiteId });
    return response.data;
};

// Remove website from folder
export const removeFromCollection = async (collectionId: string, websiteId: string) => {
    const response = await api.put(`/collections/${collectionId}/remove`, { websiteId });
    return response.data;
};

// Delete folder
export const deleteCollection = async (collectionId: string) => {
    const response = await api.delete(`/collections/${collectionId}`);
    return response.data;
};