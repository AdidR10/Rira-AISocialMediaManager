<script lang="ts">
	let { width = 'max-w-3xl', class: className = '', children } = $props();
</script>

<main class="mx-auto {width} p-6 {className}">
	{@render children()}
</main>
