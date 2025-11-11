<script lang="ts">
	import Page from '$lib/components/shared/Page.svelte';
	import PostCard from '$lib/components/schedule/PostCard.svelte';
	import ImagePreviewDialog from '$lib/components/schedule/ImagePreviewDialog.svelte';
	import { ImageIcon } from '@lucide/svelte';
	import { categorizePosts } from '$lib/utils';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	const { data } = $props();
	let { posts } = $derived(data);

	const now = $derived(Math.floor(Date.now() / 1000));

	const { pastPosts, upcomingPosts, unscheduledPosts } = $derived(categorizePosts(posts, now));

	let totalPosts = $derived(posts.length);

	let previewImage = $state<string | null>(null);

	const handleImageClick = (url: string) => {
		previewImage = url;
	};

	const handleClosePreview = () => {
		previewImage = null;
	};

	const handleOpenPost = (postId: string) => {
		console.log('Open post:', postId);
	};
</script>

<svelte:head>
	<title>Schedule - Rira</title>
</svelte:head>

<Page class="space-y-6 md:space-y-12">
	{#if totalPosts === 0}
		<div class="card preset-tonal-surface p-16 text-center">
			<ImageIcon class="mx-auto mb-6 h-20 w-20 opacity-20" />
			<h4 class="mb-3 h4">No posts yet</h4>
			<p class="opacity-60">Create your first post to get started with scheduling</p>
		</div>
	{:else}
		<Tabs defaultValue="scheduled">
			<Tabs.List>
				<Tabs.Trigger class="flex-1" value="scheduled">Scheduled</Tabs.Trigger>
				<Tabs.Trigger class="flex-1" value="published">Published</Tabs.Trigger>
				<Tabs.Trigger class="flex-1" value="unscheduled">Unscheduled</Tabs.Trigger>
				<Tabs.Indicator />
			</Tabs.List>

			<Tabs.Content value="scheduled">
				{#if upcomingPosts.length > 0}
					<section class="mt-6">
						<div class="space-y-2">
							{#each upcomingPosts as post (post.postId)}
								<PostCard
									{post}
									type="upcoming"
									currentTime={now}
									onImageClick={handleImageClick}
								/>
							{/each}
						</div>
					</section>
				{:else}
					<div class="mt-6 card preset-tonal-surface p-12 text-center">
						<ImageIcon class="mx-auto mb-4 h-16 w-16 opacity-20" />
						<h5 class="mb-2 h5">No scheduled posts</h5>
						<p class="text-sm opacity-60">Schedule posts to see them here</p>
					</div>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="published">
				{#if pastPosts.length > 0}
					<section class="mt-6">
						<div class="space-y-2">
							{#each pastPosts as post (post.postId)}
								<PostCard
									{post}
									type="past"
									currentTime={now}
									onImageClick={handleImageClick}
									onOpenPost={handleOpenPost}
								/>
							{/each}
						</div>
					</section>
				{:else}
					<div class="mt-6 card preset-tonal-surface p-12 text-center">
						<ImageIcon class="mx-auto mb-4 h-16 w-16 opacity-20" />
						<h5 class="mb-2 h5">No published posts</h5>
						<p class="text-sm opacity-60">Published posts will appear here</p>
					</div>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="unscheduled">
				{#if unscheduledPosts.length > 0}
					<section class="mt-6">
						<div class="space-y-2">
							{#each unscheduledPosts as post (post.postId)}
								<PostCard
									{post}
									type="unscheduled"
									currentTime={now}
									onImageClick={handleImageClick}
								/>
							{/each}
						</div>
					</section>
				{:else}
					<div class="mt-6 card preset-tonal-surface p-12 text-center">
						<ImageIcon class="mx-auto mb-4 h-16 w-16 opacity-20" />
						<h5 class="mb-2 h5">No unscheduled posts</h5>
						<p class="text-sm opacity-60">Create posts to schedule them later</p>
					</div>
				{/if}
			</Tabs.Content>
		</Tabs>
	{/if}
</Page>

<ImagePreviewDialog imageUrl={previewImage} onClose={handleClosePreview} />
