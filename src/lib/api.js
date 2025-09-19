// API service for handling fetch requests
// Compatible with Tizen OS 4 browser

class ApiService {
	constructor(baseUrl = '') {
		this.baseUrl = baseUrl;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
		};
	}

	// Generic fetch method with error handling
	async request(endpoint, options = {}) {
		const url = `${this.baseUrl}${endpoint}`;
		const config = {
			method: 'GET',
			headers: { ...this.defaultHeaders, ...options.headers },
			...options
		};

		try {
			const response = await fetch(url, config);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				return await response.json();
			} else {
				return await response.text();
			}
		} catch (error) {
			console.error('API request failed:', error);
			throw new Error(`API request failed: ${error.message}`);
		}
	}

	// GET request
	async get(endpoint, options = {}) {
		return this.request(endpoint, { ...options, method: 'GET' });
	}

	// POST request
	async post(endpoint, data, options = {}) {
		return this.request(endpoint, {
			...options,
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	// PUT request
	async put(endpoint, data, options = {}) {
		return this.request(endpoint, {
			...options,
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	// DELETE request
	async delete(endpoint, options = {}) {
		return this.request(endpoint, { ...options, method: 'DELETE' });
	}

	// Fetch JSON data from URL
	async fetchJson(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error('Failed to fetch JSON:', error);
			throw error;
		}
	}

	// Fetch text data from URL
	async fetchText(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.text();
		} catch (error) {
			console.error('Failed to fetch text:', error);
			throw error;
		}
	}
}

// Create a default instance
export const api = new ApiService();

// Export the class for custom instances
export { ApiService };

// Sample API endpoints for demonstration
export const sampleEndpoints = {
	// JSONPlaceholder API for testing
	posts: 'https://jsonplaceholder.typicode.com/posts',
	users: 'https://jsonplaceholder.typicode.com/users',
	photos: 'https://jsonplaceholder.typicode.com/photos',
	
	// Sample image URLs for carousel
	images: [
		'https://picsum.photos/800/400?random=1',
		'https://picsum.photos/800/400?random=2',
		'https://picsum.photos/800/400?random=3',
		'https://picsum.photos/800/400?random=4',
		'https://picsum.photos/800/400?random=5'
	]
};
