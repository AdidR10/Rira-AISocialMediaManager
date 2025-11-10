<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import XIcon from '@lucide/svelte/icons/x';

	interface Props {
		imageUrl: string | null;
		onClose: () => void;
	}

	let { imageUrl, onClose }: Props = $props();
	let dialogOpen = $state(false);

	$effect(() => {
		dialogOpen = !!imageUrl;
	});
</script>

{#if imageUrl}
	<Dialog open={dialogOpen} onOpenChange={(details) => !details.open && onClose()}>
		<Portal>
			<Dialog.Backdrop class="fixed inset-0 z-50 bg-black/80" />
			<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
				<Dialog.Content class="relative max-h-[90vh] max-w-[90vw]">
					<img
						src={imageUrl}
						alt="Full size preview"
						class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
					/>
					<Dialog.CloseTrigger
						onclick={() => {
							dialogOpen = false;
							onClose();
						}}
						class="absolute -top-4 -right-4 rounded-full bg-surface-900/80 p-2 text-white transition-colors hover:bg-surface-800"
					>
						<span class="text-2xl leading-none">
							<XIcon class="size-6" />
						</span>
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
{/if}
