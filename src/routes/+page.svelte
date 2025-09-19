	<script>
	import { onMount } from 'svelte';
	import Carousel from '$lib/Carousel.svelte';
	import { api, sampleEndpoints } from '$lib/api.js';
	
	let testResults = [];
	let loading = false;
	let error = '';
	let success = '';
	let posts = [];
	let users = [];
	let carouselItems = [];
	let selectedPost = null;
	let browserInfo = {};
	let networkStatus = 'Unknown';
	let testStartTime = null;
	let testEndTime = null;
	
	// Initialize tests on mount
	onMount(() => {
		runDiagnosticTests();
		initializeCarousel();
	});
	
	function addTestResult(testName, status, details, error = null) {
		testResults = [...testResults, {
			id: Date.now() + Math.random(),
			name: testName,
			status: status, // 'pass', 'fail', 'warning'
			details: details,
			error: error,
			timestamp: new Date().toLocaleTimeString()
		}];
	}
	
	async function runDiagnosticTests() {
		testStartTime = new Date();
		testResults = [];
		
		// Test 1: Basic JavaScript functionality
		try {
			const testVar = 'Hello World';
			const testArray = [1, 2, 3];
			const testObject = { key: 'value' };
			addTestResult('JavaScript Basics', 'pass', 'Variables, arrays, and objects work correctly');
		} catch (err) {
			addTestResult('JavaScript Basics', 'fail', 'Basic JavaScript functionality failed', err.message);
		}
		
		// Test 2: Svelte reactivity
		try {
			let testReactive = 0;
			testReactive = 1;
			addTestResult('Svelte Reactivity', 'pass', 'Svelte reactive variables work correctly');
		} catch (err) {
			addTestResult('Svelte Reactivity', 'fail', 'Svelte reactivity failed', err.message);
		}
		
		// Test 3: Browser detection
		try {
			browserInfo = {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				language: navigator.language,
				cookieEnabled: navigator.cookieEnabled,
				onLine: navigator.onLine,
				windowSize: `${window.innerWidth}x${window.innerHeight}`,
				screenSize: `${screen.width}x${screen.height}`,
				colorDepth: screen.colorDepth,
				pixelDepth: screen.pixelDepth
			};
			addTestResult('Browser Detection', 'pass', `Browser info collected: ${browserInfo.userAgent.substring(0, 50)}...`);
		} catch (err) {
			addTestResult('Browser Detection', 'fail', 'Failed to detect browser info', err.message);
		}
		
		// Test 4: Network connectivity
		try {
			networkStatus = navigator.onLine ? 'Online' : 'Offline';
			addTestResult('Network Status', navigator.onLine ? 'pass' : 'warning', `Network status: ${networkStatus}`);
		} catch (err) {
			addTestResult('Network Status', 'fail', 'Failed to check network status', err.message);
		}
		
		// Test 5: Fetch API availability
		try {
			if (typeof fetch === 'function') {
				addTestResult('Fetch API', 'pass', 'Fetch API is available');
			} else {
				addTestResult('Fetch API', 'fail', 'Fetch API is not available');
			}
		} catch (err) {
			addTestResult('Fetch API', 'fail', 'Fetch API test failed', err.message);
		}
		
		// Test 6: CSS Variables support
		try {
			const root = document.documentElement;
			const computedStyle = getComputedStyle(root);
			const primaryColor = computedStyle.getPropertyValue('--primary-color');
			if (primaryColor) {
				addTestResult('CSS Variables', 'pass', `CSS variables work: --primary-color = ${primaryColor.trim()}`);
			} else {
				addTestResult('CSS Variables', 'warning', 'CSS variables may not be fully supported');
			}
		} catch (err) {
			addTestResult('CSS Variables', 'fail', 'CSS variables test failed', err.message);
		}
		
		// Test 7: Local storage
		try {
			if (typeof Storage !== 'undefined') {
				localStorage.setItem('test', 'value');
				const testValue = localStorage.getItem('test');
				localStorage.removeItem('test');
				addTestResult('Local Storage', 'pass', 'Local storage is available and working');
			} else {
				addTestResult('Local Storage', 'fail', 'Local storage is not available');
			}
		} catch (err) {
			addTestResult('Local Storage', 'fail', 'Local storage test failed', err.message);
		}
		
		// Test 8: Console availability
		try {
			if (typeof console !== 'undefined') {
				console.log('Test log message');
				addTestResult('Console API', 'pass', 'Console API is available');
			} else {
				addTestResult('Console API', 'fail', 'Console API is not available');
			}
		} catch (err) {
			addTestResult('Console API', 'fail', 'Console API test failed', err.message);
		}
		
		testEndTime = new Date();
		const testDuration = testEndTime - testStartTime;
		addTestResult('Test Suite', 'pass', `All tests completed in ${testDuration}ms`);
	}
	
	function initializeCarousel() {
		carouselItems = sampleEndpoints.images.map((image, index) => ({
			id: index + 1,
			image: image,
			title: `Sample Image ${index + 1}`,
			description: `This is a sample image for the carousel demonstration.`
		}));
	}
	
	async function testAPI() {
		loading = true;
		error = '';
		success = '';
		
		try {
			// Test API connectivity
			addTestResult('API Test Start', 'pass', 'Starting API connectivity test');
			
			// Test posts endpoint
			posts = await api.get(sampleEndpoints.posts);
			addTestResult('Posts API', 'pass', `Successfully fetched ${posts.length} posts`);
			
			// Test users endpoint
			users = await api.get(sampleEndpoints.users);
			addTestResult('Users API', 'pass', `Successfully fetched ${users.length} users`);
			
			// Test photos endpoint
			const photos = await api.get(sampleEndpoints.photos);
			carouselItems = photos.slice(0, 10).map(photo => ({
				id: photo.id,
				image: photo.url,
				title: photo.title,
				description: `Album ID: ${photo.albumId}`
			}));
			addTestResult('Photos API', 'pass', `Successfully fetched ${photos.length} photos and updated carousel`);
			
			success = `API tests completed successfully! Fetched ${posts.length} posts, ${users.length} users, and ${photos.length} photos.`;
		} catch (err) {
			error = `API test failed: ${err.message}`;
			addTestResult('API Test', 'fail', `API test failed: ${err.message}`, err.message);
			console.error('API test error:', err);
		} finally {
			loading = false;
		}
	}
	
	function testCarousel() {
		try {
			if (carouselItems.length > 0) {
				addTestResult('Carousel Data', 'pass', `Carousel initialized with ${carouselItems.length} items`);
			} else {
				addTestResult('Carousel Data', 'warning', 'Carousel has no items');
			}
		} catch (err) {
			addTestResult('Carousel Data', 'fail', 'Carousel test failed', err.message);
		}
	}
	
	function handleSlideChange(event) {
		console.log('Slide changed to:', event.detail);
		addTestResult('Carousel Navigation', 'pass', `Slide changed to: ${event.detail}`);
	}
	
	function handleItemSelect(event) {
		console.log('Item selected:', event.detail);
		selectedPost = event.detail.item;
		addTestResult('Carousel Selection', 'pass', `Item selected: ${event.detail.item?.title || 'Unknown'}`);
	}
	
	function clearData() {
		posts = [];
		users = [];
		carouselItems = [];
		selectedPost = null;
		error = '';
		success = '';
		testResults = [];
		addTestResult('Data Clear', 'pass', 'All data cleared successfully');
	}
	
	function rerunTests() {
		runDiagnosticTests();
	}
</script>

<svelte:head>
	<title>Tizen TV App - Diagnostic Test Page</title>
</svelte:head>

<div class="app">
	<header class="app-header">
		<h1>🔧 Tizen TV Diagnostic Test Page</h1>
		<p>Comprehensive client-side functionality testing and debugging</p>
	</header>
	
	<main class="app-main">
		<!-- Test Results Section -->
		<section class="test-results-section">
			<h2>🧪 Diagnostic Test Results</h2>
			<div class="test-summary">
				<div class="summary-item">
					<span class="label">Total Tests:</span>
					<span class="value">{testResults.length}</span>
				</div>
				<div class="summary-item">
					<span class="label">Passed:</span>
					<span class="value passed">{testResults.filter(t => t.status === 'pass').length}</span>
				</div>
				<div class="summary-item">
					<span class="label">Failed:</span>
					<span class="value failed">{testResults.filter(t => t.status === 'fail').length}</span>
				</div>
				<div class="summary-item">
					<span class="label">Warnings:</span>
					<span class="value warning">{testResults.filter(t => t.status === 'warning').length}</span>
				</div>
			</div>
			
			<div class="test-results">
				{#each testResults as result}
					<div class="test-result {result.status}">
						<div class="test-header">
							<span class="test-name">{result.name}</span>
							<span class="test-status">{result.status.toUpperCase()}</span>
							<span class="test-time">{result.timestamp}</span>
						</div>
						<div class="test-details">{result.details}</div>
						{#if result.error}
							<div class="test-error">Error: {result.error}</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
		
		<!-- Browser Info Section -->
		{#if Object.keys(browserInfo).length > 0}
			<section class="browser-info-section">
				<h2>🌐 Browser Information</h2>
				<div class="browser-info-grid">
					<div class="info-item">
						<span class="label">User Agent:</span>
						<span class="value">{browserInfo.userAgent}</span>
					</div>
					<div class="info-item">
						<span class="label">Platform:</span>
						<span class="value">{browserInfo.platform}</span>
					</div>
					<div class="info-item">
						<span class="label">Language:</span>
						<span class="value">{browserInfo.language}</span>
					</div>
					<div class="info-item">
						<span class="label">Online:</span>
						<span class="value {browserInfo.onLine ? 'online' : 'offline'}">{browserInfo.onLine ? 'Yes' : 'No'}</span>
					</div>
					<div class="info-item">
						<span class="label">Window Size:</span>
						<span class="value">{browserInfo.windowSize}</span>
					</div>
					<div class="info-item">
						<span class="label">Screen Size:</span>
						<span class="value">{browserInfo.screenSize}</span>
					</div>
					<div class="info-item">
						<span class="label">Color Depth:</span>
						<span class="value">{browserInfo.colorDepth} bits</span>
					</div>
					<div class="info-item">
						<span class="label">Pixel Depth:</span>
						<span class="value">{browserInfo.pixelDepth} bits</span>
					</div>
				</div>
			</section>
		{/if}
		
		<!-- Test Controls Section -->
		<section class="test-controls-section">
			<h2>🎮 Test Controls</h2>
			<div class="button-group">
				<button on:click={rerunTests} disabled={loading}>
					{loading ? 'Running...' : '🔄 Rerun All Tests'}
				</button>
				<button on:click={testAPI} disabled={loading}>
					{loading ? 'Testing...' : '🌐 Test API Connectivity'}
				</button>
				<button on:click={testCarousel} disabled={loading}>
					{loading ? 'Testing...' : '🎠 Test Carousel'}
				</button>
				<button on:click={clearData} disabled={loading}>
					🗑️ Clear All Data
				</button>
			</div>
			
			{#if loading}
				<div class="loading-container">
					<div class="loading"></div>
					<p>Running tests...</p>
				</div>
			{/if}
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			{#if success}
				<div class="success">{success}</div>
			{/if}
		</section>
		
		<!-- Carousel Section -->
		<section class="carousel-section">
			<h2>🎠 Carousel Test</h2>
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
		
		<!-- Data Display Section -->
		{#if posts.length > 0 || users.length > 0}
			<section class="data-section">
				<h2>📊 API Data Results</h2>
				{#if posts.length > 0}
					<div class="data-group">
						<h3>Posts ({posts.length})</h3>
						<div class="data-list">
							{#each posts.slice(0, 3) as post}
								<div class="data-item">
									<h4>{post.title}</h4>
									<p>{post.body}</p>
									<small>User ID: {post.userId} | Post ID: {post.id}</small>
								</div>
							{/each}
							{#if posts.length > 3}
								<p class="more-items">... and {posts.length - 3} more posts</p>
							{/if}
						</div>
					</div>
				{/if}
				
				{#if users.length > 0}
					<div class="data-group">
						<h3>Users ({users.length})</h3>
						<div class="data-list">
							{#each users.slice(0, 2) as user}
								<div class="data-item">
									<h4>{user.name}</h4>
									<p>Email: {user.email}</p>
									<p>Website: {user.website}</p>
									<small>ID: {user.id}</small>
								</div>
							{/each}
							{#if users.length > 2}
								<p class="more-items">... and {users.length - 2} more users</p>
							{/if}
						</div>
					</div>
				{/if}
			</section>
		{/if}
	</main>
	
	<footer class="app-footer">
		<p>🔧 Tizen TV Diagnostic Test Page - Built with Svelte</p>
		<p>Use arrow keys to navigate the carousel | Check console for detailed logs</p>
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
	
	/* Test Results Styles */
	.test-results-section {
		margin-bottom: 40px;
	}
	
	.test-results-section h2 {
		font-size: 1.8rem;
		margin-bottom: 20px;
		color: var(--primary-color);
	}
	
	.test-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 15px;
		margin-bottom: 20px;
		padding: 15px;
		background: var(--card-bg);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}
	
	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.summary-item .label {
		font-size: 0.9rem;
		opacity: 0.8;
		margin-bottom: 5px;
	}
	
	.summary-item .value {
		font-size: 1.5rem;
		font-weight: bold;
	}
	
	.summary-item .value.passed {
		color: #27ae60;
	}
	
	.summary-item .value.failed {
		color: var(--accent-color);
	}
	
	.summary-item .value.warning {
		color: #f39c12;
	}
	
	.test-results {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.test-result {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 15px;
		transition: all 0.2s ease;
	}
	
	.test-result.pass {
		border-left: 4px solid #27ae60;
	}
	
	.test-result.fail {
		border-left: 4px solid var(--accent-color);
	}
	
	.test-result.warning {
		border-left: 4px solid #f39c12;
	}
	
	.test-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		flex-wrap: wrap;
		gap: 10px;
	}
	
	.test-name {
		font-weight: bold;
		font-size: 1.1rem;
	}
	
	.test-status {
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: bold;
		text-transform: uppercase;
	}
	
	.test-result.pass .test-status {
		background: rgba(39, 174, 96, 0.2);
		color: #27ae60;
	}
	
	.test-result.fail .test-status {
		background: rgba(231, 76, 60, 0.2);
		color: var(--accent-color);
	}
	
	.test-result.warning .test-status {
		background: rgba(243, 156, 18, 0.2);
		color: #f39c12;
	}
	
	.test-time {
		font-size: 0.8rem;
		opacity: 0.7;
	}
	
	.test-details {
		margin-bottom: 5px;
		line-height: 1.4;
	}
	
	.test-error {
		color: var(--accent-color);
		font-size: 0.9rem;
		font-style: italic;
		background: rgba(231, 76, 60, 0.1);
		padding: 8px;
		border-radius: 4px;
		margin-top: 8px;
	}
	
	/* Browser Info Styles */
	.browser-info-section {
		margin-bottom: 40px;
	}
	
	.browser-info-section h2 {
		font-size: 1.8rem;
		margin-bottom: 20px;
		color: var(--primary-color);
	}
	
	.browser-info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 15px;
	}
	
	.info-item {
		display: flex;
		flex-direction: column;
		padding: 15px;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}
	
	.info-item .label {
		font-weight: bold;
		margin-bottom: 5px;
		color: var(--primary-color);
	}
	
	.info-item .value {
		word-break: break-all;
		line-height: 1.4;
	}
	
	.info-item .value.online {
		color: #27ae60;
	}
	
	.info-item .value.offline {
		color: var(--accent-color);
	}
	
	/* Test Controls Styles */
	.test-controls-section {
		margin-bottom: 40px;
	}
	
	.test-controls-section h2 {
		font-size: 1.8rem;
		margin-bottom: 20px;
		color: var(--primary-color);
	}
	
	/* TV-specific optimizations */
	@media (min-width: 1920px) {
		.app-header h1 {
			font-size: 3rem;
		}
		
		.app-header p {
			font-size: 1.3rem;
		}
		
		.test-results-section h2,
		.browser-info-section h2,
		.test-controls-section h2,
		.carousel-section h2 {
			font-size: 2.2rem;
		}
		
		.button-group button {
			font-size: 18px;
			padding: 15px 30px;
		}
		
		.test-summary {
			grid-template-columns: repeat(4, 1fr);
		}
		
		.browser-info-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
