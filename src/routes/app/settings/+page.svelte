<script lang="ts">
	import Page from '$lib/components/shared/Page.svelte';
	import EditIntegrationDialog from '$lib/components/settings/EditIntegrationDialog.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { LogOutIcon } from '@lucide/svelte';
	import FacebookIcon from '@icons-pack/svelte-simple-icons/icons/SiFacebook';
	import { toaster } from '$lib/toaster.js';
	import { signOut } from '$lib/auth-client.js';

	const { data } = $props();
	let { organization, user } = $derived(data);
	let { integration } = $derived(data);

	async function updateIntegration(updates: any) {
		const response = await fetch('/api/update/integration', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!response.ok) {
			throw new Error('Failed to update integration');
		}

		await invalidateAll();
	}

	const handleLogout = async () => {
		await signOut();
		goto('/', { replaceState: true });
		toaster.success({ title: 'Logged out successfully' });
	};

	const maskApiKey = (key: string | null | undefined): string => {
		if (!key) return '—';
		if (key.length <= 8) return '****';
		return key.substring(0, 4) + '***********';
	};
</script>

<svelte:head>
	<title>Settings - Rira</title>
</svelte:head>

<Page class="space-y-6 md:space-y-12">
	<section class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div class="md:space-y-2">
			<h1 class="text-xl font-bold md:text-3xl">{user.name}</h1>
			<p class="text-base opacity-70 md:text-lg">{organization.name}</p>
		</div>

		<button
			onclick={handleLogout}
			class="btn justify-center gap-2 preset-filled-surface-100-900"
			type="button"
		>
			<LogOutIcon class="h-4 w-4" />
			Log Out
		</button>
	</section>
	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">
				Integrations
			</h2>
		</div>
		<div class="space-y-3">
			<div class="flex items-center justify-between rounded-lg bg-surface-200-800 p-3">
				<div class="flex items-center gap-3">
					<FacebookIcon size={20} />
					<div>
						<p class="text-sm font-medium">Facebook</p>
						{#if integration?.facebookPageId && integration?.facebookAPIKey}
							<p class="text-xs opacity-60">Connected</p>
						{:else}
							<p class="text-xs opacity-60">Not configured</p>
						{/if}
					</div>
				</div>
				<EditIntegrationDialog {integration} onSave={updateIntegration} />
			</div>
		</div>
		<div class="border-t border-surface-300-700 pt-2">
			<p class="text-xs opacity-60">
				More integration support coming soon, including Instagram, Telegram channels, and more!
			</p>
		</div>
	</section>

	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">
				Chat Integrations
			</h2>
		</div>
		<div class="space-y-2">
			<p class="text-sm leading-relaxed opacity-80">
				In the future, you'll be able to talk to Rira in <strong>Facebook Messenger</strong>,
				<strong>Telegram</strong>, <strong>WhatsApp</strong>, and your messaging app of choice.
			</p>
			<p class="text-xs opacity-60">
				Connect your preferred messaging platforms to chat with Rira seamlessly across all your
				channels.
			</p>
		</div>
	</section>

	<section class="space-y-4 card preset-filled-surface-100-900 p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xs font-semibold tracking-wider text-primary-700-300 uppercase">About</h2>
		</div>
		<div class="space-y-2">
			<p class="text-sm leading-relaxed opacity-80">
				This project was created for the <strong>SOLVIO AI Hackathon</strong>.
			</p>
			<p class="text-xs opacity-60">
				Built with SvelteKit, Drizzle ORM, and powered by AI-driven content generation.
			</p>
		</div>
	</section>
</Page>
