<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';

	interface Props {
		organization: {
			designInstructions?: string | null;
		};
		onSave: (data: { designInstructions?: string }) => Promise<void>;
	}

	let { organization, onSave }: Props = $props();
	let dialogOpen = $state(false);

	let formData = $state({
		designInstructions: organization.designInstructions || ''
	});

	let isSubmitting = $state(false);
	let error = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			await onSave({
				designInstructions: formData.designInstructions || undefined
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
			<Dialog.Content class="w-full max-w-lg space-y-4 card bg-surface-100-900 p-6 shadow-xl">
				<Dialog.Title class="h4">Edit Design Instructions</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Update your organization's design guidelines
				</Dialog.Description>

				<form onsubmit={handleSubmit} class="space-y-4">
					<label class="label">
						<span class="text-sm font-medium opacity-80">Design Instructions</span>
						<textarea
							class="textarea"
							bind:value={formData.designInstructions}
							rows="8"
							placeholder="Enter design guidelines, style preferences, and visual direction..."
						></textarea>
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
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
