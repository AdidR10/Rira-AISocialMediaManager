<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';

	interface Props {
		organization: {
			primaryColor?: string | null;
		};
		onSave: (data: { primaryColor?: string }) => Promise<void>;
	}

	let { organization, onSave }: Props = $props();
	let dialogOpen = $state(false);

	let formData = $state({
		primaryColor: organization.primaryColor || '#000000'
	});

	let isSubmitting = $state(false);
	let error = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			await onSave({
				primaryColor: formData.primaryColor || undefined
			});
			dialogOpen = false;
		} catch (e) {
			error = 'Failed to save changes';
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<Dialog open={dialogOpen}>
	<Dialog.Trigger
		onclick={() => {
			dialogOpen = true;
		}}
		class="rounded p-1.5 transition-colors hover:bg-surface-200 dark:hover:bg-surface-700"
	>
		<SquarePenIcon class="h-4 w-4 opacity-60" />
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="w-full max-w-md space-y-4 card bg-surface-100-900 p-6 shadow-xl">
				<Dialog.Title class="h4">Edit Primary Color</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Choose your brand's primary color
				</Dialog.Description>

				<form onsubmit={handleSubmit} class="space-y-4">
					<label class="label">
						<span class="text-sm font-medium opacity-80">Primary Color</span>
						<div class="flex items-center gap-3">
							<input
								type="color"
								class="h-16 w-16 cursor-pointer rounded border-2 border-surface-300-700"
								bind:value={formData.primaryColor}
							/>
							<input
								type="text"
								class="input flex-1"
								bind:value={formData.primaryColor}
								placeholder="#000000"
							/>
						</div>
					</label>
					{#if error}
						<p class="text-sm text-error-500">{error}</p>
					{/if}

					<div class="flex justify-end gap-2">
						<Dialog.CloseTrigger
							onclick={() => {
								dialogOpen = false;
							}}
							class="btn preset-tonal"
							disabled={isSubmitting}
						>
							Cancel
						</Dialog.CloseTrigger>
						<button type="submit" class="btn preset-filled" disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
