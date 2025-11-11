<script lang="ts">
	import Page from '$lib/components/shared/Page.svelte';
	import EditIdentityDialog from '$lib/components/brand/EditIdentityDialog.svelte';
	import EditColorDialog from '$lib/components/brand/EditColorDialog.svelte';
	import EditTypographyDialog from '$lib/components/brand/EditTypographyDialog.svelte';
	import EditDesignDialog from '$lib/components/brand/EditDesignDialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { ImageIcon, PencilIcon } from '@lucide/svelte';

	const { data } = $props();
	let { organization } = $derived(data);

	let fileInputRef: HTMLInputElement | undefined = $state();
	let isUploadingLogo = $state(false);

	async function updateOrganization(updates: any) {
		const response = await fetch('/api/update/brand', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!response.ok) {
			throw new Error('Failed to update organization');
		}

		await invalidateAll();
	}

	const triggerFileInput = () => {
		fileInputRef?.click();
	};

	const handleLogoUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploadingLogo = true;

		try {
			const formData = new FormData();
			formData.append('logo', file);

			const response = await fetch('/api/upload/logo', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload logo');
			}

			await invalidateAll();

			if (fileInputRef) {
				fileInputRef.value = '';
			}
		} catch (e: any) {
			console.error('Failed to upload logo:', e);
			alert(e.message || 'Failed to upload logo');
		} finally {
			isUploadingLogo = false;
		}
	};
</script>

<svelte:head>
	<title>Brand - Rira</title>
</svelte:head>

<Page class="space-y-6 md:space-y-12">
	<section class="flex justify-center">
		<div class="group relative">
			<input
				bind:this={fileInputRef}
				type="file"
				accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
				onchange={handleLogoUpload}
				class="hidden"
				disabled={isUploadingLogo}
			/>

			{#if organization.logo}
				<button
					onclick={triggerFileInput}
					disabled={isUploadingLogo}
					class="relative block"
					type="button"
				>
					<img src={organization.logo.url} alt="Organization logo" class="size-24 object-contain" />
					<div
						class="bg-surface-900-50 absolute top-2 right-2 rounded-full border border-surface-300-700 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<PencilIcon class="h-4 w-4" />
					</div>
				</button>
			{:else}
				<button
					onclick={triggerFileInput}
					disabled={isUploadingLogo}
					class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300-700 bg-surface-100-900 transition-colors hover:border-primary-500"
					type="button"
				>
					<ImageIcon class="mb-2 h-12 w-12 opacity-40" />
					<p class="text-xs">
						{isUploadingLogo ? 'Uploading...' : 'Click to add logo'}
					</p>
				</button>
			{/if}
		</div>
	</section>

	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">Identity</h2>
			<EditIdentityDialog {organization} onSave={updateOrganization} />
		</div>
		<div class="space-y-3">
			<p class="text-lg">{organization.name || '—'}</p>
			{#if organization.tagline}
				<p class="opacity-90">{organization.tagline}</p>
			{/if}
			{#if organization.description}
				<p class="leading-relaxed opacity-80">{organization.description}</p>
			{/if}
		</div>
	</section>

	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">Colors</h2>
			<EditColorDialog {organization} onSave={updateOrganization} />
		</div>
		<div>
			<p class="mb-2 text-xs font-medium">Primary Color</p>
			{#if organization.primaryColor}
				<div class="flex items-center gap-3">
					<span
						class="h-8 w-8 rounded border border-surface-300-700"
						style="background-color: {organization.primaryColor}"
					></span>
					<span class="text-sm opacity-80">{organization.primaryColor}</span>
				</div>
			{:else}
				<p class="text-sm italic opacity-50">No primary color set</p>
			{/if}
		</div>
	</section>

	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">
				Typography
			</h2>
			<EditTypographyDialog {organization} onSave={updateOrganization} />
		</div>
		<div class="space-y-2">
			{#if organization.primaryFont}
				<p class="text-sm opacity-80">{organization.primaryFont}</p>
			{/if}
			{#if organization.secondaryFont}
				<p class="text-sm opacity-70">{organization.secondaryFont}</p>
			{/if}
			{#if !organization.primaryFont && !organization.secondaryFont}
				<p class="text-sm italic opacity-50">No fonts set</p>
			{/if}
		</div>
	</section>

	{#if organization.designInstructions}
		<section class="space-y-4 card preset-filled-surface-100-900 p-5">
			<div class="flex items-center justify-between">
				<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">
					Instructions
				</h2>
				<EditDesignDialog {organization} onSave={updateOrganization} />
			</div>
			<p class="text-sm leading-relaxed whitespace-pre-wrap opacity-70">
				{organization.designInstructions}
			</p>
		</section>
	{:else}
		<section class="space-y-4 card preset-filled-surface-100-900 p-5">
			<div class="flex items-center justify-between">
				<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">
					Instructions
				</h2>
				<EditDesignDialog {organization} onSave={updateOrganization} />
			</div>
			<p class="text-sm italic opacity-50">No design instructions set</p>
		</section>
	{/if}
</Page>
