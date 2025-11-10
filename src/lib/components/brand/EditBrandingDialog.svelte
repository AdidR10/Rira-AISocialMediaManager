<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { invalidateAll } from '$app/navigation';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';

	interface Props {
		organization: {
			logo?: { name: string; type: string; url: string } | null;
			primaryColor?: string | null;
		};
		onSave: (data: { primaryColor?: string }) => Promise<void>;
		open?: boolean;
	}

	let { organization, onSave, open = $bindable(false) }: Props = $props();

	let formData = $state({
		primaryColor: organization.primaryColor || ''
	});

	let logoFile: File | null = $state(null);
	let fileInputRef: HTMLInputElement | undefined = $state();
	let isSubmitting = $state(false);
	let isUploadingLogo = $state(false);
	let error = $state('');
	let uploadProgress = $state('');

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			logoFile = file;
		}
	}

	const handleLogoUpload = async () => {
		if (!logoFile) return;

		isUploadingLogo = true;
		uploadProgress = 'Uploading logo...';
		error = '';

		try {
			const formData = new FormData();
			formData.append('logo', logoFile);

			const response = await fetch('/api/upload/logo', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload logo');
			}

			uploadProgress = 'Logo uploaded successfully!';
			logoFile = null;
			if (fileInputRef) {
				fileInputRef.value = '';
			}

			// Refresh the page data
			await invalidateAll();

			// Clear success message after 2 seconds
			setTimeout(() => {
				uploadProgress = '';
			}, 2000);
		} catch (e: any) {
			error = e.message || 'Failed to upload logo';
			console.error(e);
		} finally {
			isUploadingLogo = false;
		}
	};

	const handleRemoveLogo = async () => {
		isSubmitting = true;
		error = '';

		try {
			await onSave({ logo: null } as any);
			await invalidateAll();
		} catch (e) {
			error = 'Failed to remove logo';
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			const data: any = {};

			if (formData.primaryColor) {
				data.primaryColor = formData.primaryColor;
			} else {
				data.primaryColor = null;
			}

			await onSave(data);
		} catch (e) {
			error = 'Failed to save changes';
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<Dialog
	{open}
	onOpenChange={(details) => {
		open = details.open;
	}}
>
	<Dialog.Trigger
		class="rounded p-1.5 transition-colors hover:bg-surface-200 dark:hover:bg-surface-700"
	>
		<SquarePenIcon class="h-4 w-4 opacity-60" />
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto card bg-surface-100-900 p-6 shadow-xl"
			>
				<Dialog.Title class="h4">Edit Branding</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Update your organization's visual identity
				</Dialog.Description>

				<div class="space-y-6">
					<!-- Logo Section -->
					<div class="space-y-3">
						<h3 class="text-sm font-semibold opacity-80">Logo</h3>

						{#if organization.logo}
							<div class="space-y-3 card bg-surface-200-800 p-4">
								<div class="flex items-center gap-4">
									<img
										src={organization.logo.url}
										alt={organization.logo.name}
										class="h-16 w-16 rounded border border-surface-300-700 object-contain"
									/>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">{organization.logo.name}</p>
										<p class="text-xs opacity-60">{organization.logo.type}</p>
									</div>
								</div>
								<button
									type="button"
									onclick={handleRemoveLogo}
									disabled={isSubmitting}
									class="btn w-full preset-tonal-error text-sm"
								>
									Remove Logo
								</button>
							</div>
						{:else}
							<p class="text-sm italic opacity-50">No logo set</p>
						{/if}

						<div class="space-y-2">
							<label class="label">
								<span class="text-sm font-medium opacity-70">Upload New Logo</span>
								<input
									bind:this={fileInputRef}
									type="file"
									accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
									onchange={handleFileSelect}
									class="input"
									disabled={isUploadingLogo}
								/>
							</label>

							{#if logoFile}
								<div class="flex items-center gap-2">
									<span class="text-sm opacity-70">{logoFile.name}</span>
									<button
										type="button"
										onclick={handleLogoUpload}
										disabled={isUploadingLogo}
										class="preset-filled-primary btn text-sm"
									>
										{isUploadingLogo ? 'Uploading...' : 'Upload'}
									</button>
								</div>
							{/if}

							{#if uploadProgress}
								<p class="text-sm text-success-500">{uploadProgress}</p>
							{/if}
						</div>
					</div>

					<form onsubmit={handleSubmit} class="space-y-4">
						<label class="label">
							<span class="text-sm font-medium opacity-80">Primary Color</span>
							<div class="flex gap-2">
								<input
									type="color"
									class="h-10 w-12 cursor-pointer rounded"
									bind:value={formData.primaryColor}
								/>
								<input
									type="text"
									class="input flex-1"
									bind:value={formData.primaryColor}
									placeholder="#000000"
									pattern="^#[0-9A-Fa-f]{6}$"
								/>
							</div>
						</label>

						{#if error}
							<p class="text-sm text-error-500">{error}</p>
						{/if}

						<div class="flex justify-end gap-2">
							<Dialog.CloseTrigger
								onclick={() => {
									open = false;
								}}
								class="btn preset-tonal"
								disabled={isSubmitting || isUploadingLogo}
							>
								Close
							</Dialog.CloseTrigger>
							<button
								type="submit"
								class="btn preset-filled"
								disabled={isSubmitting || isUploadingLogo}
							>
								{isSubmitting ? 'Saving...' : 'Save Color'}
							</button>
						</div>
					</form>
				</div>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
