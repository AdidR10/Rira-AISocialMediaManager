<script lang="ts">
	import {
		Dialog,
		Portal,
		Combobox,
		useListCollection,
		type ComboboxRootProps
	} from '@skeletonlabs/skeleton-svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';

	interface Props {
		organization: {
			primaryFont?: string | null;
			secondaryFont?: string | null;
		};
		onSave: (data: { primaryFont?: string; secondaryFont?: string }) => Promise<void>;
	}

	let { organization, onSave }: Props = $props();
	let dialogOpen = $state(false);

	const fontOptions = [
		{ label: 'Inter', value: 'Inter', className: 'font-sans' },
		{ label: 'Space Grotesk', value: 'Space Grotesk', className: 'font-space-grotesk' },
		{
			label: 'নোটো সেরিফ বাংলা',
			value: 'Noto Serif Bengali',
			className: 'font-noto-serif-bengali'
		},
		{ label: 'গালাদা', value: 'Galada', className: 'font-galada' }
	];

	let primaryFontItems = $state(fontOptions);
	let secondaryFontItems = $state(fontOptions);

	const primaryFontCollection = $derived(
		useListCollection({
			items: primaryFontItems,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value
		})
	);

	const secondaryFontCollection = $derived(
		useListCollection({
			items: secondaryFontItems,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value
		})
	);

	let primaryFontValue = $state(organization.primaryFont ? [organization.primaryFont] : []);
	let secondaryFontValue = $state(organization.secondaryFont ? [organization.secondaryFont] : []);

	let isSubmitting = $state(false);
	let error = $state('');

	const onPrimaryFontOpenChange = () => {
		primaryFontItems = fontOptions;
	};

	const onPrimaryFontInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = fontOptions.filter((item) =>
			item.value.toLowerCase().includes(event.inputValue.toLowerCase())
		);
		primaryFontItems = filtered.length > 0 ? filtered : fontOptions;
	};

	const onPrimaryFontValueChange: ComboboxRootProps['onValueChange'] = (event) => {
		primaryFontValue = event.value;
	};

	const onSecondaryFontOpenChange = () => {
		secondaryFontItems = fontOptions;
	};

	const onSecondaryFontInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = fontOptions.filter((item) =>
			item.value.toLowerCase().includes(event.inputValue.toLowerCase())
		);
		secondaryFontItems = filtered.length > 0 ? filtered : fontOptions;
	};

	const onSecondaryFontValueChange: ComboboxRootProps['onValueChange'] = (event) => {
		secondaryFontValue = event.value;
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			await onSave({
				primaryFont: primaryFontValue[0] || undefined,
				secondaryFont: secondaryFontValue[0] || undefined
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
		class="rounded p-1.5 transition-colors hover:bg-surface-200-800"
	>
		<SquarePenIcon class="h-4 w-4 opacity-60" />
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="w-full max-w-lg space-y-4 card bg-surface-100-900 p-6 shadow-xl">
				<Dialog.Title class="h4">Edit Typography</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Choose your brand's font families
				</Dialog.Description>

				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="space-y-2">
						<span class="text-sm font-medium opacity-80">Primary Font</span>
						<Combobox
							class="w-full"
							placeholder="Search fonts..."
							collection={primaryFontCollection}
							onOpenChange={onPrimaryFontOpenChange}
							onInputValueChange={onPrimaryFontInputValueChange}
							value={primaryFontValue}
							onValueChange={onPrimaryFontValueChange}
						>
							<Combobox.Control>
								<Combobox.Input class="input" />
								<Combobox.Trigger />
							</Combobox.Control>
							<Portal>
								<Combobox.Positioner class="z-100!">
									<Combobox.Content
										class="max-h-60 overflow-auto card bg-surface-100-900 p-2 shadow-xl"
									>
										{#each primaryFontItems as item (item.value)}
											<Combobox.Item {item} class="cursor-pointer px-3 py-2">
												<Combobox.ItemText class={item.className}>{item.label}</Combobox.ItemText>
												<Combobox.ItemIndicator />
											</Combobox.Item>
										{/each}
									</Combobox.Content>
								</Combobox.Positioner>
							</Portal>
						</Combobox>
					</div>

					<div class="space-y-2">
						<span class="text-sm font-medium opacity-80">Secondary Font</span>
						<Combobox
							class="w-full"
							placeholder="Search fonts..."
							collection={secondaryFontCollection}
							onOpenChange={onSecondaryFontOpenChange}
							onInputValueChange={onSecondaryFontInputValueChange}
							value={secondaryFontValue}
							onValueChange={onSecondaryFontValueChange}
						>
							<Combobox.Control>
								<Combobox.Input class="input" />
								<Combobox.Trigger />
							</Combobox.Control>
							<Portal>
								<Combobox.Positioner class="z-100!">
									<Combobox.Content
										class="max-h-60 overflow-auto card bg-surface-100-900 p-2 shadow-xl"
									>
										{#each secondaryFontItems as item (item.value)}
											<Combobox.Item {item} class="cursor-pointer rounded px-3 py-2">
												<Combobox.ItemText>{item.label}</Combobox.ItemText>
												<Combobox.ItemIndicator />
											</Combobox.Item>
										{/each}
									</Combobox.Content>
								</Combobox.Positioner>
							</Portal>
						</Combobox>
					</div>

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
