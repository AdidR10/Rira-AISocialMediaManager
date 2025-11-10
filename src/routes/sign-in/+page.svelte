<script lang="ts">
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import MailIcon from '@lucide/svelte/icons/mail';
	import LockIcon from '@lucide/svelte/icons/lock';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { signIn } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const authData: { email: string; password: string } = $state({
		email: '',
		password: ''
	});

	let isLoading = $state(false);
	let rememberMe = $state(false);
	let errorMessage = $state('');

	const onLogin = async (event: SubmitEvent) => {
		event.preventDefault();
		isLoading = true;
		errorMessage = '';

		try {
			await signIn.email({
				email: authData.email,
				password: authData.password,
				rememberMe: rememberMe
			});
			goto('/app');
		} catch (error) {
			errorMessage = 'Invalid email or password. Please try again.';
			console.error('Login error:', error);
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign In - Rira</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-surface-50-950 px-6 py-12">
	<div class="w-full max-w-md space-y-8">
		<!-- Logo & Header -->
		<div class="space-y-2 text-center">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-primary-500 transition-colors hover:text-primary-600"
			>
				<SparklesIcon class="h-8 w-8" />
				<span class="text-2xl font-bold">Rira</span>
			</a>
			<h2 class="h2 tracking-tight">Welcome back</h2>
			<p class="text-surface-600-300 text-lg">Sign in to continue to your account</p>
		</div>

		{#if errorMessage}
			<div class="card preset-filled-error-500 p-4">
				<p class="text-sm font-medium text-white">{errorMessage}</p>
			</div>
		{/if}

		<form onsubmit={onLogin} class="space-y-6">
			<label class="label">
				<span class="mb-3 label-text text-base font-medium">Email address</span>
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">
						<MailIcon size={18} />
					</div>
					<input
						class="ig-input py-2"
						type="email"
						id="email"
						placeholder="you@example.com"
						bind:value={authData.email}
						required
						disabled={isLoading}
					/>
				</div>
			</label>

			<label class="label">
				<span class="mb-3 label-text text-base font-medium">Password</span>
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">
						<LockIcon size={18} />
					</div>
					<input
						class="ig-input py-2"
						type="password"
						id="password"
						placeholder="••••••••"
						bind:value={authData.password}
						required
						disabled={isLoading}
					/>
				</div>
			</label>

			<label class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" bind:checked={rememberMe} />
				<span class="text-sm">Remember me</span>
			</label>

			<button
				type="submit"
				class="btn w-full preset-filled-primary-500 text-base font-medium"
				disabled={isLoading}
			>
				{#if isLoading}
					<span>Signing in...</span>
				{:else}
					<span>Sign in</span>
					<ArrowRightIcon size={18} />
				{/if}
			</button>
		</form>

		<p class="text-surface-600-300 text-center text-sm">
			Don't have an account?
			<a href="/sign-up" class="font-medium text-primary-500 hover:text-primary-600">
				Sign up for free
			</a>
		</p>
	</div>
</div>
