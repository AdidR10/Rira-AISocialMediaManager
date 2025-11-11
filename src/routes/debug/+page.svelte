<script lang="ts">
	import Page from '$lib/components/shared/Page.svelte';

	let scrollContainer: HTMLDivElement;
	let targetElement = '';

	// Generate 30 random elements with different colors and content
	const elements = Array.from({ length: 30 }, (_, i) => ({
		id: i + 1,
		color: `hsl(${Math.random() * 360}, 70%, 60%)`,
		text: `Element ${i + 1}`,
		content: `Random content: ${Math.random().toString(36).substring(7)}`
	}));

	function scrollToElement() {
		const elementNumber = parseInt(targetElement);

		if (isNaN(elementNumber) || elementNumber < 1 || elementNumber > 30) {
			alert('Please enter a valid number between 1 and 30');
			return;
		}

		const element = document.getElementById(`element-${elementNumber}`);
		if (element && scrollContainer) {
			// Get the element's position relative to the scroll container
			const elementRect = element.getBoundingClientRect();
			const containerRect = scrollContainer.getBoundingClientRect();
			const relativeTop = elementRect.top - containerRect.top;

			// Scroll to position the element at the top of the container
			scrollContainer.scrollTo({
				top: scrollContainer.scrollTop + relativeTop,
				behavior: 'smooth'
			});
		}
	}
</script>

<svelte:head>
	<title>Debug - Rira</title>
</svelte:head>

<Page>
	<div class="container">
		<h1 class="title">Scroll to Element Demo</h1>

		<div class="controls">
			<input
				type="number"
				bind:value={targetElement}
				placeholder="Enter element number (1-30)"
				min="1"
				max="30"
				class="input"
			/>
			<button on:click={scrollToElement} class="button"> Scroll to Element </button>
		</div>

		<div class="scroll-container" bind:this={scrollContainer}>
			{#each elements as element}
				<div id="element-{element.id}" class="element" style="background-color: {element.color}">
					<h2>{element.text}</h2>
					<p>{element.content}</p>
				</div>
			{/each}
			<div class="bottom-spacer"></div>
		</div>
	</div>
</Page>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		position: sticky;
		top: 0;
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #e2e8f0;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.button {
		padding: 0.75rem 1.5rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.button:hover {
		background-color: #2563eb;
	}

	.button:active {
		background-color: #1d4ed8;
	}

	.scroll-container {
		max-height: 600px;
		overflow-y: auto;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		padding: 1rem;
	}

	.bottom-spacer {
		height: 500px;
		/* This ensures there's always enough space to scroll any element to the top */
	}

	.element {
		padding: 2rem;
		margin-bottom: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.element:hover {
		transform: translateX(4px);
	}

	.element h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.9);
	}

	.element p {
		margin: 0;
		color: rgba(0, 0, 0, 0.7);
		font-size: 1rem;
	}

	/* Custom scrollbar styling */
	.scroll-container::-webkit-scrollbar {
		width: 8px;
	}

	.scroll-container::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 4px;
	}

	.scroll-container::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}

	.scroll-container::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
