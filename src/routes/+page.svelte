	<script>
	let message = 'Loading...';
	let counter = 0;
	let browserInfo = {};
	let testResults = [];
	let isVisible = false;
	
	// Simple test without onMount to avoid potential issues
	message = 'Svelte is working!';
	counter = 1;
	isVisible = true;
	
	// Run basic tests immediately
	testResults = [
		{ name: 'JavaScript', status: 'PASS', details: 'Basic JS works' },
		{ name: 'Svelte', status: 'PASS', details: 'Reactivity works' }
	];
	
	// Try to get browser info safely
	try {
		browserInfo = {
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			online: navigator.onLine,
			windowSize: `${window.innerWidth}x${window.innerHeight}`
		};
		testResults.push({ name: 'Browser', status: 'PASS', details: 'Browser info collected' });
	} catch (err) {
		testResults.push({ name: 'Browser', status: 'FAIL', details: err.message });
	}
	
	// Test Fetch API
	try {
		if (typeof fetch === 'function') {
			testResults.push({ name: 'Fetch API', status: 'PASS', details: 'Fetch is available' });
		} else {
			testResults.push({ name: 'Fetch API', status: 'FAIL', details: 'Fetch not available' });
		}
	} catch (err) {
		testResults.push({ name: 'Fetch API', status: 'FAIL', details: err.message });
	}
	
	function incrementCounter() {
		counter += 1;
	}
	
	function testFetch() {
		fetch('https://jsonplaceholder.typicode.com/posts/1')
			.then(response => response.json())
			.then(data => {
				message = `Fetch works! Got: ${data.title}`;
			})
			.catch(err => {
				message = `Fetch failed: ${err.message}`;
			});
	}
</script>

<svelte:head>
	<title>Tizen TV App - Simple Test</title>
</svelte:head>

{#if isVisible}
<div class="app">
	<header>
		<h1>🔧 Tizen TV Simple Test</h1>
		<p>Basic functionality test - Page is visible!</p>
	</header>
	
	<main>
		<div class="test-section">
			<h2>Status: {message}</h2>
			<p>Counter: {counter}</p>
			<button on:click={incrementCounter}>Increment Counter</button>
			<button on:click={testFetch}>Test Fetch API</button>
		</div>
		
		<div class="test-section">
			<h2>Test Results</h2>
			{#each testResults as result}
				<div class="test-result {result.status.toLowerCase()}">
					<strong>{result.name}:</strong> {result.status} - {result.details}
				</div>
			{/each}
		</div>
		
		<div class="test-section">
			<h2>Browser Info</h2>
			<p><strong>User Agent:</strong> {browserInfo.userAgent || 'Not available'}</p>
			<p><strong>Platform:</strong> {browserInfo.platform || 'Not available'}</p>
			<p><strong>Online:</strong> {browserInfo.online ? 'Yes' : 'No'}</p>
			<p><strong>Window Size:</strong> {browserInfo.windowSize || 'Not available'}</p>
		</div>
	</main>
</div>
{:else}
<div class="app">
	<header>
		<h1>🔧 Tizen TV Simple Test</h1>
		<p>Loading...</p>
	</header>
	<main>
		<div class="test-section">
			<h2>Page is not visible yet</h2>
			<p>This suggests there might be an issue with Svelte rendering.</p>
		</div>
	</main>
</div>
{/if}

<style>
	.app {
		min-height: 100vh;
		padding: 20px;
		background: #000;
		color: #fff;
		font-family: Arial, sans-serif;
	}
	
	header {
		text-align: center;
		margin-bottom: 30px;
		padding: 20px;
		background: #222;
		border-radius: 8px;
	}
	
	header h1 {
		font-size: 2rem;
		margin-bottom: 10px;
		color: #00a8ff;
	}
	
	header p {
		font-size: 1.1rem;
		opacity: 0.8;
	}
	
	main {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.test-section {
		background: #111;
		padding: 20px;
		margin-bottom: 20px;
		border-radius: 8px;
		border: 1px solid #333;
	}
	
	.test-section h2 {
		font-size: 1.5rem;
		margin-bottom: 15px;
		color: #00a8ff;
	}
	
	.test-section p {
		margin-bottom: 10px;
		line-height: 1.4;
	}
	
	button {
		background: #00a8ff;
		color: white;
		border: none;
		padding: 10px 20px;
		margin: 5px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}
	
	button:hover {
		background: #0088cc;
	}
	
	.test-result {
		padding: 10px;
		margin: 5px 0;
		border-radius: 4px;
		border-left: 4px solid #333;
	}
	
	.test-result.pass {
		border-left-color: #27ae60;
		background: rgba(39, 174, 96, 0.1);
	}
	
	.test-result.fail {
		border-left-color: #e74c3c;
		background: rgba(231, 76, 60, 0.1);
	}
	
	/* TV-specific optimizations */
	@media (min-width: 1920px) {
		header h1 {
			font-size: 3rem;
		}
		
		header p {
			font-size: 1.3rem;
		}
		
		.test-section h2 {
			font-size: 2rem;
		}
		
		button {
			font-size: 18px;
			padding: 15px 30px;
		}
	}
</style>
