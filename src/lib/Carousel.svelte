<script>
	import { onMount, createEventDispatcher } from 'svelte';
	
	export let items = [];
	export let autoplay = true;
	export let interval = 3000;
	export let showDots = true;
	export let showArrows = true;
	
	const dispatch = createEventDispatcher();
	
	let currentIndex = 0;
	let carouselContainer;
	let autoplayInterval;
	let isPaused = false;
	
	$: if (items.length > 0 && currentIndex >= items.length) {
		currentIndex = 0;
	}
	
	$: if (items.length > 0 && currentIndex < 0) {
		currentIndex = items.length - 1;
	}
	
	function nextSlide() {
		if (items.length === 0) return;
		currentIndex = (currentIndex + 1) % items.length;
		dispatch('slideChange', { index: currentIndex, item: items[currentIndex] });
	}
	
	function prevSlide() {
		if (items.length === 0) return;
		currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
		dispatch('slideChange', { index: currentIndex, item: items[currentIndex] });
	}
	
	function goToSlide(index) {
		if (index >= 0 && index < items.length) {
			currentIndex = index;
			dispatch('slideChange', { index: currentIndex, item: items[currentIndex] });
		}
	}
	
	function pauseAutoplay() {
		isPaused = true;
		if (autoplayInterval) {
			clearInterval(autoplayInterval);
		}
	}
	
	function resumeAutoplay() {
		isPaused = false;
		if (autoplay && !isPaused) {
			autoplayInterval = setInterval(nextSlide, interval);
		}
	}
	
	onMount(() => {
		if (autoplay && !isPaused) {
			autoplayInterval = setInterval(nextSlide, interval);
		}
		
		return () => {
			if (autoplayInterval) {
				clearInterval(autoplayInterval);
			}
		};
	});
	
	// Handle keyboard navigation for TV remote
	function handleKeydown(event) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				prevSlide();
				break;
			case 'ArrowRight':
				event.preventDefault();
				nextSlide();
				break;
			case 'Enter':
				event.preventDefault();
				dispatch('itemSelect', { index: currentIndex, item: items[currentIndex] });
				break;
		}
	}
</script>

<div 
	class="carousel" 
	on:keydown={handleKeydown}
	on:mouseenter={pauseAutoplay}
	on:mouseleave={resumeAutoplay}
	tabindex="0"
	role="region"
	aria-label="Image carousel"
>
	<div class="carousel-container" bind:this={carouselContainer}>
		{#if items.length > 0}
			{#each items as item, index}
				<div 
					class="carousel-slide" 
					class:active={index === currentIndex}
					style="transform: translateX(${(index - currentIndex) * 100}%)"
				>
					{#if item.image}
						<img src={item.image} alt={item.title || `Slide ${index + 1}`} />
					{/if}
					{#if item.title || item.description}
						<div class="slide-content">
							{#if item.title}
								<h3 class="slide-title">{item.title}</h3>
							{/if}
							{#if item.description}
								<p class="slide-description">{item.description}</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		{:else}
			<div class="carousel-slide active">
				<div class="slide-content">
					<p>No items to display</p>
				</div>
			</div>
		{/if}
	</div>
	
	{#if showArrows && items.length > 1}
		<button 
			class="carousel-arrow carousel-arrow-left" 
			on:click={prevSlide}
			aria-label="Previous slide"
		>
			‹
		</button>
		<button 
			class="carousel-arrow carousel-arrow-right" 
			on:click={nextSlide}
			aria-label="Next slide"
		>
			›
		</button>
	{/if}
	
	{#if showDots && items.length > 1}
		<div class="carousel-dots">
			{#each items as _, index}
				<button 
					class="carousel-dot" 
					class:active={index === currentIndex}
					on:click={() => goToSlide(index)}
					aria-label="Go to slide {index + 1}"
				>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.carousel {
		position: relative;
		width: 100%;
		height: 400px;
		overflow: hidden;
		border-radius: 8px;
		background: var(--card-bg);
		outline: none;
	}
	
	.carousel:focus {
		outline: 3px solid var(--primary-color);
		outline-offset: 2px;
	}
	
	.carousel-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		transition: transform 0.3s ease;
	}
	
	.carousel-slide {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	
	.carousel-slide.active {
		opacity: 1;
	}
	
	.carousel-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
	}
	
	.slide-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		padding: 20px;
		color: white;
	}
	
	.slide-title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 8px;
	}
	
	.slide-description {
		font-size: 16px;
		opacity: 0.9;
	}
	
	.carousel-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 2;
	}
	
	.carousel-arrow:hover {
		background: rgba(0, 0, 0, 0.8);
		transform: translateY(-50%) scale(1.1);
	}
	
	.carousel-arrow:focus {
		outline: 3px solid var(--primary-color);
		outline-offset: 2px;
	}
	
	.carousel-arrow-left {
		left: 10px;
	}
	
	.carousel-arrow-right {
		right: 10px;
	}
	
	.carousel-dots {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 8px;
		z-index: 2;
	}
	
	.carousel-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.carousel-dot:hover {
		background: rgba(255, 255, 255, 0.8);
		transform: scale(1.2);
	}
	
	.carousel-dot.active {
		background: var(--primary-color);
		transform: scale(1.2);
	}
	
	.carousel-dot:focus {
		outline: 2px solid var(--primary-color);
		outline-offset: 2px;
	}
</style>
