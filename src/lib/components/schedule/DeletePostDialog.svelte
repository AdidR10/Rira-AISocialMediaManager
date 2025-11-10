<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { invalidateAll } from '$app/navigation';
	import type { Post } from '$lib/types';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let dialogOpen = $state(false);
	let isDeleting = $state(false);
	let error = $state('');

	const handleDelete = async () => {
		isDeleting = true;
		error = '';

		try {
			const response = await fetch('/api/delete/post', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					postId: post.postId
				})
			});

			if (!response.ok) {
				throw new Error('Failed to delete post');
			}

			await invalidateAll();
			dialogOpen = false;
		} catch (e) {
			error = 'Failed to delete post';
			console.error(e);
		} finally {
			isDeleting = false;
		}
	};
</script>

<Dialog open={dialogOpen}>
	<Dialog.Trigger
		onclick={() => {
			dialogOpen = true;
		}}
		class="btn btn-sm hover:preset-tonal-error"
		title="Delete Post"
	>
		<TrashIcon class="h-3.5 w-3.5" />
		<span class="text-xs">Delete</span>
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="w-full max-w-sm space-y-4 card bg-surface-100-900 p-6 shadow-xl">
				<Dialog.Title class="h4">Delete Post</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Are you sure you want to delete this post? This action cannot be undone.
				</Dialog.Description>

				{#if error}
					<p class="text-sm text-error-500">{error}</p>
				{/if}

				<div class="flex justify-end gap-2">
					<Dialog.CloseTrigger
						onclick={() => {
							dialogOpen = false;
						}}
						class="btn preset-tonal"
						disabled={isDeleting}
					>
						Cancel
					</Dialog.CloseTrigger>
					<button onclick={handleDelete} class="btn preset-filled-error-500" disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
