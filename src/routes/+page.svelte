<script>
	import { onMount } from 'svelte';
	import Carousel from '$lib/Carousel.svelte';
	import { api, sampleEndpoints } from '$lib/api.js';
	
	let loading = false;
	let error = '';
	let success = '';
	let posts = [];
	let users = [];
	let carouselItems = [];
	let selectedPost = null;
	
	// Initialize carousel with sample images
	onMount(() => {
		initializeCarousel();
	});
	
	function initializeCarousel() {
		carouselItems = sampleEndpoints.images.map((image, index) => ({
			id: index + 1,
			image: image,
			title: `Sample Image ${index + 1}`,
			description: `This is a sample image for the carousel demonstration.`
		}));
	}
	
	async function fetchPosts() {
		loading = true;
		error = '';
		success = '';
		
		try {
			posts = await api.get(sampleEndpoints.posts);
			success = `Successfully fetched ${posts.length} posts!`;
		} catch (err) {
			error = `Failed to fetch posts: ${err.message}`;
			console.error('Error fetching posts:', err);
		} finally {
			loading = false;
		}
	}
	
	async function fetchUsers() {
		loading = true;
		error = '';
		success = '';
		
		try {
			users = await api.get(sampleEndpoints.users);
			success = `Successfully fetched ${users.length} users!`;
		} catch (err) {
			error = `Failed to fetch users: ${err.message}`;
			console.error('Error fetching users:', err);
		} finally {
			loading = false;
		}
	}
	
	async function fetchPhotos() {
		loading = true;
		error = '';
		success = '';
		
		try {
			const photos = await api.get(sampleEndpoints.photos);
			// Update carousel with fetched photos
			carouselItems = photos.slice(0, 10).map(photo => ({
				id: photo.id,
				image: photo.url,
				title: photo.title,
				description: `Album ID: ${photo.albumId}`
			}));
			success = `Successfully updated carousel with ${carouselItems.length} photos!`;
		} catch (err) {
			error = `Failed to fetch photos: ${err.message}`;
			console.error('Error fetching photos:', err);
		} finally {
			loading = false;
		}
	}
	
	function handleSlideChange(event) {
		console.log('Slide changed to:', event.detail);
	}
	
	function handleItemSelect(event) {
		console.log('Item selected:', event.detail);
		selectedPost = event.detail.item;
	}
	
	function clearData() {
		posts = [];
		users = [];
		carouselItems = [];
		selectedPost = null;
		error = '';
		success = '';
	}
</script>

<svelte:head>
	<title>Tizen TV App - Svelte with Fetch & Carousel</title>
</svelte:head>

<div class="app">
	<header class="app-header">
		<h1>Tizen TV App</h1>
		<p>Svelte application with fetch functionality and carousel for Samsung TV</p>
	</header>
	
	<main class="app-main">
		<!-- Carousel Section -->
		<section class="carousel-section">
			<h2>Image Carousel</h2>
			<Carousel 
				items={carouselItems}
				autoplay={true}
				interval={4000}
				on:slideChange={handleSlideChange}
				on:itemSelect={handleItemSelect}
			/>
			{#if selectedPost}
				<div class="selected-item">
					<h3>Selected Item:</h3>
					<p><strong>Title:</strong> {selectedPost.title}</p>
					{#if selectedPost.description}
						<p><strong>Description:</strong> {selectedPost.description}</p>
					{/if}
				</div>
			{/if}
		</section>
		
		<!-- API Controls Section -->
		<section class="controls-section">
			<h2>API Controls</h2>
			<div class="button-group">
				<button on:click={fetchPosts} disabled={loading}>
					{loading ? 'Loading...' : 'Fetch Posts'}
				</button>
				<button on:click={fetchUsers} disabled={loading}>
					{loading ? 'Loading...' : 'Fetch Users'}
				</button>
				<button on:click={fetchPhotos} disabled={loading}>
					{loading ? 'Loading...' : 'Fetch Photos'}
				</button>
				<button on:click={clearData} disabled={loading}>
					Clear Data
				</button>
			</div>
			
			{#if loading}
				<div class="loading-container">
					<div class="loading"></div>
					<p>Loading data...</p>
				</div>
			{/if}
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			{#if success}
				<div class="success">{success}</div>
			{/if}
		</section>
		
		<!-- Data Display Section -->
		{#if posts.length > 0 || users.length > 0}
			<section class="data-section">
				{#if posts.length > 0}
					<div class="data-group">
						<h3>Posts ({posts.length})</h3>
						<div class="data-list">
							{#each posts.slice(0, 5) as post}
								<div class="data-item">
									<h4>{post.title}</h4>
									<p>{post.body}</p>
									<small>User ID: {post.userId} | Post ID: {post.id}</small>
								</div>
							{/each}
							{#if posts.length > 5}
								<p class="more-items">... and {posts.length - 5} more posts</p>
							{/if}
						</div>
					</div>
				{/if}
				
				{#if users.length > 0}
					<div class="data-group">
						<h3>Users ({users.length})</h3>
						<div class="data-list">
							{#each users.slice(0, 3) as user}
								<div class="data-item">
									<h4>{user.name}</h4>
									<p>Email: {user.email}</p>
									<p>Website: {user.website}</p>
									<small>ID: {user.id}</small>
								</div>
							{/each}
							{#if users.length > 3}
								<p class="more-items">... and {users.length - 3} more users</p>
							{/if}
						</div>
					</div>
				{/if}
			</section>
		{/if}
	</main>
	
	<footer class="app-footer">
		<p>Built with Svelte for Tizen OS 4 Samsung TV</p>
		<p>Use arrow keys to navigate the carousel</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-color);
		color: var(--text-color);
	}
	
	.app-header {
		text-align: center;
		padding: 20px;
		background: var(--secondary-color);
		border-bottom: 2px solid var(--primary-color);
	}
	
	.app-header h1 {
		font-size: 2.5rem;
		margin-bottom: 10px;
		color: var(--primary-color);
	}
	
	.app-header p {
		font-size: 1.1rem;
		opacity: 0.8;
	}
	
	.app-main {
		flex: 1;
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}
	
	.carousel-section {
		margin-bottom: 40px;
	}
	
	.carousel-section h2 {
		font-size: 1.8rem;
		margin-bottom: 20px;
		color: var(--primary-color);
	}
	
	.selected-item {
		margin-top: 20px;
		padding: 15px;
		background: var(--card-bg);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}
	
	.controls-section {
		margin-bottom: 40px;
	}
	
	.controls-section h2 {
		font-size: 1.8rem;
		margin-bottom: 20px;
		color: var(--primary-color);
	}
	
	.button-group {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	
	.button-group button {
		flex: 1;
		min-width: 150px;
	}
	
	.loading-container {
		text-align: center;
		padding: 20px;
	}
	
	.loading-container .loading {
		margin: 0 auto 10px;
	}
	
	.data-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}
	
	.data-group h3 {
		font-size: 1.4rem;
		margin-bottom: 15px;
		color: var(--primary-color);
	}
	
	.data-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.data-item {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 15px;
		transition: all 0.2s ease;
	}
	
	.data-item:hover {
		border-color: var(--primary-color);
		transform: translateY(-1px);
	}
	
	.data-item h4 {
		font-size: 1.1rem;
		margin-bottom: 8px;
		color: var(--primary-color);
	}
	
	.data-item p {
		margin-bottom: 5px;
		line-height: 1.4;
	}
	
	.data-item small {
		color: #888;
		font-size: 0.9rem;
	}
	
	.more-items {
		text-align: center;
		font-style: italic;
		color: #888;
		margin-top: 10px;
	}
	
	.app-footer {
		text-align: center;
		padding: 20px;
		background: var(--secondary-color);
		border-top: 1px solid var(--border-color);
		opacity: 0.8;
	}
	
	.app-footer p {
		margin: 5px 0;
	}
	
	/* TV-specific optimizations */
	@media (min-width: 1920px) {
		.app-header h1 {
			font-size: 3rem;
		}
		
		.app-header p {
			font-size: 1.3rem;
		}
		
		.carousel-section h2,
		.controls-section h2 {
			font-size: 2.2rem;
		}
		
		.button-group button {
			font-size: 18px;
			padding: 15px 30px;
		}
	}
</style>
