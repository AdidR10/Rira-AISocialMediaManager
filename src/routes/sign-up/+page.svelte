<script lang="ts">
	import { SparklesIcon, MailIcon, LockIcon, UserIcon, ArrowRightIcon } from '@lucide/svelte';
	import { signUp } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const authData: { name: string; email: string; password: string; confirmPassword: string } =
		$state({
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		});

	let isLoading = $state(false);
	let errorMessage = $state('');

	const onRegister = async (event: SubmitEvent) => {
		event.preventDefault();
		isLoading = true;
		errorMessage = '';

		// Validation
		if (authData.password !== authData.confirmPassword) {
			errorMessage = 'Passwords do not match. Please try again.';
			isLoading = false;
			return;
		}

		if (authData.password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long.';
			isLoading = false;
			return;
		}

		try {
			await signUp.email({
				email: authData.email,
				password: authData.password,
				name: authData.name,
				callbackURL: '/app'
			});
			goto('/app');
		} catch (error) {
			errorMessage = 'Failed to create account. Email may already be in use.';
			console.error('Registration error:', error);
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign Up - Rira</title>
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
			<h2 class="h2 tracking-tight">Create your account</h2>
			<p class="text-surface-600-300 text-lg">Start managing your social media with AI</p>
		</div>

		<!-- Error Message -->
		{#if errorMessage}
			<div class="card preset-filled-error-500 p-4">
				<p class="text-sm font-medium text-white">{errorMessage}</p>
			</div>
		{/if}

		<!-- Register Form -->
		<form onsubmit={onRegister} class="space-y-5">
			<!-- Name Input -->
			<label class="label">
				<span class="mb-3 label-text text-base font-medium">Full name</span>
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">
						<UserIcon size={18} />
					</div>
					<input
						class="ig-input py-2"
						type="text"
						id="name"
						placeholder="John Doe"
						bind:value={authData.name}
						required
						disabled={isLoading}
					/>
				</div>
			</label>

			<!-- Email Input -->
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

			<!-- Password Input -->
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
						minlength="8"
						disabled={isLoading}
					/>
				</div>
				<span class="text-xs opacity-70">Must be at least 8 characters</span>
			</label>

			<!-- Confirm Password Input -->
			<label class="label">
				<span class="mb-3 label-text text-base font-medium">Confirm password</span>
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">
						<LockIcon size={18} />
					</div>
					<input
						class="ig-input py-2"
						type="password"
						id="confirmPassword"
						placeholder="••••••••"
						bind:value={authData.confirmPassword}
						required
						minlength="8"
						disabled={isLoading}
					/>
				</div>
			</label>

			<button
				type="submit"
				class="btn w-full preset-filled-primary-500 text-base font-medium"
				disabled={isLoading}
			>
				{#if isLoading}
					<span>Creating account...</span>
				{:else}
					<span>Create account</span>
					<ArrowRightIcon size={18} />
				{/if}
			</button>
		</form>

		<!-- Sign In Link -->
		<p class="text-surface-600-300 text-center text-sm">
			Already have an account?
			<a href="/sign-in" class="font-medium text-primary-500 hover:text-primary-600">
				Sign in instead
			</a>
		</p>
	</div>
</div>
