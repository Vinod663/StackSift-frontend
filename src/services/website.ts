import api from './api';

export interface Website {
  _id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  upvotes: string[];
  views: number;
  approved: boolean;
  addedBy: string;
  createdAt: string;
}

interface WebsiteResponse {
  websites: Website[];
  totalPages: number;
  totalWebsites: number;
}

// 1. Get All Websites (with Search & Filter)
export const getWebsites = async (search = '', category = '', page = 1, limit = 12) => {
  // Pass search params to the backend
  const response = await api.get<WebsiteResponse>(`/post?search=${search}&category=${category}&page=${page}&limit=${limit}`);
  return response.data;
};

// 2. Like a Website
export const likeWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/like`);
  return response.data;
};

// 3. View a Website (Track clicks)
export const viewWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/view`);
  return response.data;
};

// 4. (Admin Only) Approve Website
export const approveWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/approve`); 
  return response.data;
};

// 5. Call AI Search
export const searchWebsitesAI = async (query: string) => {
  const response = await api.post('/post/search-ai', { query });
  return response.data.websites; // Returns array of tools
};