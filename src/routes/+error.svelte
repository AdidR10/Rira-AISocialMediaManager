<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
	<h1 class="h1">{page.status}</h1>
	<p class="max-w-2xl text-center text-xl opacity-80">{page.error?.message}</p>

	<a href="/" class="btn preset-filled-primary-500">Go Back Home</a>
</div>
