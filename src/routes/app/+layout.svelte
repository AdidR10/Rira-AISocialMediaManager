<script lang="ts">
	import {
		PaletteIcon,
		CalendarCheckIcon,
		MessageCircleIcon,
		BotIcon,
		SettingsIcon
	} from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ label: 'Rira', href: '/app', icon: MessageCircleIcon },
		{ label: 'Schedule', href: '/app/schedule', icon: CalendarCheckIcon },
		{ label: 'Brand', href: '/app/brand', icon: PaletteIcon }
	];

	const getAnchorBarClass = (href: string) => {
		const isActive = page.url.pathname === href;
		return `btn  flex-col items-center gap-1 ${isActive ? 'preset-tonal-primary' : 'hover:preset-tonal'}`;
	};

	const getAnchorRailClass = (href: string) => {
		const isActive = page.url.pathname === href;
		return `btn aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5 ${isActive ? 'preset-tonal-primary' : 'hover:preset-tonal '}`;
	};
</script>

<svelte:head>
	<title>Rira - Dashboard</title>
</svelte:head>

<div class="min-h-screen md:grid md:grid-cols-[auto_1fr]">
	<Navigation
		layout="rail"
		class="hidden md:sticky md:top-0 md:flex md:h-screen md:overflow-y-auto"
	>
		<Navigation.Content>
			<Navigation.Header>
				<a
					href="/"
					class={getAnchorRailClass('/')}
					title="View Homepage"
					aria-label="View Homepage"
				>
					<BotIcon class="size-8" />
				</a>
			</Navigation.Header>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={getAnchorRailClass(link.href)}>
						<Icon class="size-5" />
						<span class="text-xs">{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>

			<Navigation.Footer>
				<a
					href="/app/settings"
					class={getAnchorRailClass('/app/settings')}
					title="Settings"
					aria-label="Settings"
				>
					<SettingsIcon class="size-5" />
					<span class="text-xs">Settings</span>
				</a>
			</Navigation.Footer>
		</Navigation.Content>
	</Navigation>

	<div class="min-h-screen pb-20 md:ml-0 md:pb-0">
		{@render children()}
	</div>

	<Navigation layout="bar" class="fixed right-0 bottom-0 left-0 z-50 md:hidden">
		<Navigation.Menu class="grid grid-cols-4 gap-2">
			{#each links as link (link)}
				{@const Icon = link.icon}
				<a href={link.href} class={getAnchorBarClass(link.href)}>
					<Icon class="size-5" />
					<span class="text-[10px]">{link.label}</span>
				</a>
			{/each}

			<a
				href="/app/settings"
				class={getAnchorBarClass('/app/settings')}
				title="Settings"
				aria-label="Settings"
			>
				<SettingsIcon class="size-5" />
				<span class="text-xs">Settings</span>
			</a>
		</Navigation.Menu>
	</Navigation>
</div>
