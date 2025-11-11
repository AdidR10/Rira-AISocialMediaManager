<script lang="ts">
	import Page from '$lib/components/shared/Page.svelte';
	import { Chat } from '@ai-sdk/svelte';
	import {
		SendIcon,
		ImageIcon,
		PencilIcon,
		HistoryIcon,
		FileTextIcon,
		CalendarIcon,
		CalendarOffIcon,
		LoaderIcon,
		LoaderPinwheelIcon
	} from '@lucide/svelte';
	import { onMount, tick, type Component } from 'svelte';
	import { Streamdown } from 'svelte-streamdown';
	import { fade } from 'svelte/transition';

	const { data } = $props();

	let input = $state('');
	const chat = new Chat({});
	let messagesContainer: HTMLDivElement;
	let chatInput: HTMLInputElement;
	let messagesContainerClientHeight = $state(0);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (!input.trim()) return;

		chat.sendMessage({ text: input });
		input = '';

		await tick();

		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	};

	onMount(() => {
		messagesContainerClientHeight = messagesContainer.clientHeight;
		chatInput.focus();
	});
</script>

<svelte:head>
	<title>Chat - Rira</title>
</svelte:head>

<Page class="flex h-screen flex-col">
	<div class="flex-1 overflow-hidden">
		<div
			bind:this={messagesContainer}
			class="relative h-full space-y-6 overflow-y-auto px-4 py-6"
			style="scroll-behavior: smooth;"
			id="message-container"
		>
			{#if chat.messages.length === 0}
				<div
					out:fade
					class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 space-y-4"
				>
					<h3 class="text-center h3">What's on your agenda today?</h3>
					<p class="text-center opacity-70">
						Rira can plan, create and schedule your social media posts.
					</p>
				</div>
			{/if}

			{#each chat.messages as message, messageIndex (messageIndex)}
				{@const isLastMessage = messageIndex === chat.messages.length - 1}
				<div
					data-role={message.role}
					class="flex flex-col {message.role === 'user'
						? 'items-end'
						: 'items-start'} {isLastMessage
						? message.role === 'user'
							? 'h-full'
							: 'min-h-[calc(100%-73px)]'
						: ''}"
				>
					<div class="max-w-[85%]">
						<div
							class="card px-4 py-3 whitespace-pre-wrap"
							class:preset-filled-primary-500={message.role === 'user'}
						>
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'text'}
									<div class="text-sm leading-relaxed">
										{#if message.role === 'user'}
											<p class="whitespace-pre-wrap">{part.text}</p>
										{:else}
											<Streamdown
												theme={{ paragraph: { base: 'mb-2' } }}
												animation={{ enabled: true, type: 'fade' }}
												content={part.text}
											/>
										{/if}
									</div>
								{:else if part.type === 'tool-createPhotocard'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Creating photocard...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(ImageIcon, 'Photocard created')}
									{/if}
								{:else if part.type === 'tool-editPhotocard'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Editing photocard...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(PencilIcon, 'Photocard edited')}
									{/if}
								{:else if part.type === 'tool-getLast5Photocards'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Fetching photocards...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(HistoryIcon, 'Photocards fetched')}
									{/if}
								{:else if part.type === 'tool-createPost'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Saving post...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(FileTextIcon, 'Post saved')}
									{/if}
								{:else if part.type === 'tool-editPost'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Editing post...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(PencilIcon, 'Post edited')}
									{/if}
								{:else if part.type === 'tool-schedulePost'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Scheduling post...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(CalendarIcon, 'Post scheduled')}
									{/if}
								{:else if part.type === 'tool-unschedulePost'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Unscheduling post...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(CalendarOffIcon, 'Post unscheduled')}
									{/if}
								{:else if part.type === 'tool-getLast10Posts'}
									{#if part.state === 'input-available'}
										{@render toolLoading('Fetching posts...')}
									{:else if part.state === 'output-available'}
										{@render toolCalled(HistoryIcon, 'Posts fetched')}
									{/if}
								{/if}
							{/each}
						</div>
					</div>
					{#if message.role === 'user' && isLastMessage && chat.status === 'submitted'}
						<div class="relative self-start">
							<div class="absolute top-8 left-4" in:fade|global>
								<LoaderPinwheelIcon class="h-6 w-6 animate-spin text-primary-500" />
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="shrink-0 p-4">
		<form onsubmit={handleSubmit} class="card preset-filled-surface-100-900 p-2">
			<div class="flex items-center gap-2">
				<input
					class="flex-1 rounded-lg border border-surface-300-700 bg-surface-50-950 px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-primary-500 focus:outline-none"
					bind:value={input}
					bind:this={chatInput}
					placeholder="Type your message..."
					autocomplete="off"
				/>
				<button type="submit" class="btn-icon" disabled={!input.trim()} aria-label="Send message">
					<SendIcon class="size-4" />
				</button>
			</div>
		</form>
	</div>
</Page>

{#snippet toolLoading(message: string)}
	<span in:fade|global class="my-2 inline-flex animate-pulse items-center gap-1 text-sm italic">
		<LoaderIcon class="size-4 animate-spin" />
		<span>
			{message}
		</span>
	</span>
{/snippet}

{#snippet toolCalled(Icon: Component, message: string)}
	<span class="my-2 inline-flex items-center gap-1 text-sm italic opacity-80">
		<Icon class="size-4"></Icon>
		<span>
			{message}
		</span>
	</span>
{/snippet}
