<script lang="ts">
	import EditPostDialog from '$lib/components/schedule/EditPostDialog.svelte';
	import DeletePostDialog from '$lib/components/schedule/DeletePostDialog.svelte';
	import {
		CalendarIcon,
		ImageIcon,
		ClockIcon,
		CalendarCheckIcon,
		ExternalLinkIcon
	} from '@lucide/svelte';
	import { formatDateOnly, formatTimeOnly, getTimeRemaining } from '$lib/utils';

	interface Props {
		post: {
			postId: string;
			caption: string | null;
			photocard: {
				url: string;
			} | null;
			schedule: {
				timestamp: string | null;
			} | null;
		};
		type: 'upcoming' | 'past' | 'unscheduled';
		currentTime: number;
		onImageClick: (url: string) => void;
		onOpenPost?: (postId: string) => void;
	}

	let { post, type, currentTime, onImageClick, onOpenPost }: Props = $props();
</script>

<div class="overflow-hidden card preset-filled-surface-100-900 transition-shadow hover:shadow-lg">
	<div class="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5">
		{#if post.photocard?.url}
			<div>
				<button
					onclick={() => onImageClick(post.photocard?.url || '')}
					class="aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-surface-200-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] sm:w-32"
				>
					<img src={post.photocard.url} alt="Post preview" class="h-full w-full object-cover" />
				</button>
			</div>
		{:else}
			<div
				class="flex aspect-square w-full shrink-0 items-center justify-center rounded-lg bg-surface-200-800 shadow-sm sm:w-32"
			>
				<ImageIcon class="h-10 w-10 opacity-20 sm:h-8 sm:w-8" />
			</div>
		{/if}

		<div class="flex min-w-0 flex-1 flex-col gap-3">
			<div class="flex-1">
				{#if post.caption}
					<p class="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
						{post.caption}
					</p>
				{:else}
					<p class="text-xs italic opacity-40 sm:text-sm">No caption</p>
				{/if}
			</div>

			<div class="flex flex-wrap items-center gap-2 sm:gap-3">
				<div
					class="flex items-center gap-1.5 rounded-full bg-surface-200-800 px-2 py-0.5 text-[10px] opacity-80 sm:gap-1.5 sm:px-2.5"
				>
					{#if type === 'upcoming'}
						<CalendarIcon class="h-3 w-3" />
					{:else if type === 'past'}
						<CalendarCheckIcon class="h-3 w-3" />
					{:else}
						<ClockIcon class="h-3 w-3" />
					{/if}
					<span class="font-medium">{formatDateOnly(post.schedule?.timestamp)}</span>
				</div>
				{#if post.schedule?.timestamp}
					<div
						class="flex items-center gap-1.5 rounded-full bg-surface-200-800 px-2 py-0.5 text-[10px] opacity-80 sm:gap-1.5 sm:px-2.5"
					>
						<ClockIcon class="h-3 w-3" />
						<span class="font-medium">{formatTimeOnly(post.schedule?.timestamp)}</span>
					</div>
				{/if}
				{#if type === 'upcoming' && post.schedule?.timestamp}
					{@const timeInfo = getTimeRemaining(post.schedule.timestamp, currentTime)}
					<span
						class="rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 {timeInfo.class}"
						>{timeInfo.text}</span
					>
				{/if}
			</div>
			<div class="flex flex-wrap items-center gap-2">
				{#if type === 'past' && onOpenPost}
					<button
						onclick={() => onOpenPost?.(post.postId)}
						class="btn flex-1 preset-tonal-primary btn-sm sm:flex-none"
						title="Open Post"
					>
						<ExternalLinkIcon class="h-3.5 w-3.5" />
						<span class="text-xs">Open Post</span>
					</button>
				{/if}
				{#if type !== 'past'}
					<div class="flex-1 sm:flex-none">
						<EditPostDialog {post} />
					</div>
				{/if}
				<div class="flex-1 sm:flex-none">
					<DeletePostDialog {post} />
				</div>
			</div>
		</div>
	</div>
</div>
