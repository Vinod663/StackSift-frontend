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


export interface WebsitePayload {
    title: string;
    url: string;
    description?: string;
    category?: string;
    tags?: string[];
}

// Get All Websites (with Search & Filter)
export const getWebsites = async (search = '', category = '', page = 1, limit = 9, approved?: string) => {
  // Pass search params to the backend
  const queryApproved = approved ? `&approved=${approved}` : '';
  const response = await api.get<WebsiteResponse>(`/post?search=${search}&category=${category}&page=${page}&limit=${limit}${queryApproved}`);
  return response.data;
};

export const deleteWebsite = async (id: string) => {
  const response = await api.delete(`/post/${id}`);
  return response.data;
};

//Like a Website
export const likeWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/like`);
  return response.data;
};

//View a Website (Track clicks)
export const viewWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/view`);
  return response.data;
};

//(Admin Only) Approve Website
export const approveWebsite = async (id: string) => {
  const response = await api.put(`/post/${id}/approve`); 
  return response.data;
};

// Update Website Details
export const updateWebsiteDetails = async (id: string, data: Partial<Website>) => {
  const response = await api.put(`/post/${id}`, data);
  return response.data;
};

// Call AI Search
export const searchWebsitesAI = async (query: string) => {
  const response = await api.post('/post/search-ai', { query });
  return response.data.websites; // Returns array of tools
};


export const addWebsite = async (data: WebsitePayload) => {
    const response = await api.post('/post/addWebsite', data);
    return response.data;
};