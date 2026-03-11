export const API_BASE_URL = 'https://circuit-lab.onrender.com/api';

export const projectService = {
    // 1. Get all projects
    async getProjects(token) {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return response.json();
    },

    // 2. Get a single project
    async getProject(token, projectId) {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch project ${projectId}`);
        }
        return response.json();
    },

    // 3. Create a project
    async createProject(token, projectData) {
        const response = await fetch(`${API_BASE_URL}/projects/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create project');
        }
        return response.json();
    },

    // 4. Update a project
    async updateProject(token, projectId, projectData) {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Failed to update project ${projectId}`);
        }
        return response.json();
    },

    // 5. Delete a project
    async deleteProject(token, projectId) {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete project ${projectId}`);
        }
        return true;
    }
};
