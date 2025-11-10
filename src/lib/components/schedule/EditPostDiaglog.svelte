<script lang="ts">
	import { Dialog, Portal, DatePicker, parseDate } from '@skeletonlabs/skeleton-svelte';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import { invalidateAll } from '$app/navigation';
	import type { Post } from '$lib/types';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let dialogOpen = $state(false);

	// Generate time options (every 30 minutes)
	const timeOptions = Array.from({ length: 48 }, (_, i) => {
		const hours = Math.floor(i / 2);
		const minutes = i % 2 === 0 ? '00' : '30';
		const period = hours < 12 ? 'AM' : 'PM';
		const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
		return {
			value: `${hours.toString().padStart(2, '0')}:${minutes}`,
			label: `${displayHours}:${minutes} ${period}`
		};
	});

	let formData = $state({
		caption: post.caption || '',
		date: post.schedule?.timestamp
			? parseDate(new Date(parseInt(post.schedule.timestamp) * 1000).toISOString().split('T')[0])
			: null,
		time: post.schedule?.timestamp
			? new Date(parseInt(post.schedule.timestamp) * 1000).toTimeString().slice(0, 5)
			: '09:00'
	});

	let isSubmitting = $state(false);
	let error = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		error = '';

		try {
			// Combine date and time into Unix timestamp
			let timestamp = null;
			if (formData.date) {
				const dateStr = formData.date.toString();
				const isoString = `${dateStr}T${formData.time}:00.000Z`;
				timestamp = new Date(isoString).getTime().toString();
			}

			const response = await fetch('/api/update/post', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					postId: post.postId,
					caption: formData.caption || null,
					timestamp
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update post');
			}

			await invalidateAll();
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
		class="btn preset-tonal-surface btn-sm"
	>
		<SquarePenIcon class="h-4 w-4" />
		<span>Edit</span>
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="w-full max-w-lg space-y-4 card bg-surface-100-900 p-6 shadow-xl">
				<Dialog.Title class="h4">Edit Post</Dialog.Title>
				<Dialog.Description class="text-sm opacity-70">
					Update the caption and schedule for this post
				</Dialog.Description>

				<form onsubmit={handleSubmit} class="space-y-4">
					<label class="label">
						<span class="text-sm font-medium opacity-80">Caption</span>
						<textarea
							class="textarea"
							bind:value={formData.caption}
							rows="4"
							placeholder="Enter post caption"
						></textarea>
					</label>

					<div class="space-y-2">
						<span class="text-sm font-medium opacity-80">Schedule Date</span>
						<DatePicker
							value={formData.date ? [formData.date] : []}
							onValueChange={(e) => (formData.date = e.value[0] || null)}
						>
							<DatePicker.Control>
								<DatePicker.Input placeholder="Select date" />
								<DatePicker.Trigger />
							</DatePicker.Control>
							<Portal>
								<DatePicker.Positioner>
									<DatePicker.Content class="z-100!">
										<DatePicker.View view="day">
											<DatePicker.Context>
												{#snippet children(datePicker)}
													<DatePicker.ViewControl>
														<DatePicker.PrevTrigger />
														<DatePicker.ViewTrigger>
															<DatePicker.RangeText />
														</DatePicker.ViewTrigger>
														<DatePicker.NextTrigger />
													</DatePicker.ViewControl>
													<DatePicker.Table>
														<DatePicker.TableHead>
															<DatePicker.TableRow>
																{#each datePicker().weekDays as weekDay, id (id)}
																	<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
																{/each}
															</DatePicker.TableRow>
														</DatePicker.TableHead>
														<DatePicker.TableBody>
															{#each datePicker().weeks as week, id (id)}
																<DatePicker.TableRow>
																	{#each week as day, id (id)}
																		<DatePicker.TableCell value={day}>
																			<DatePicker.TableCellTrigger
																				>{day.day}</DatePicker.TableCellTrigger
																			>
																		</DatePicker.TableCell>
																	{/each}
																</DatePicker.TableRow>
															{/each}
														</DatePicker.TableBody>
													</DatePicker.Table>
												{/snippet}
											</DatePicker.Context>
										</DatePicker.View>
										<DatePicker.View view="month">
											<DatePicker.Context>
												{#snippet children(datePicker)}
													<DatePicker.ViewControl>
														<DatePicker.PrevTrigger />
														<DatePicker.ViewTrigger>
															<DatePicker.RangeText />
														</DatePicker.ViewTrigger>
														<DatePicker.NextTrigger />
													</DatePicker.ViewControl>
													<DatePicker.Table>
														<DatePicker.TableBody>
															{#each datePicker().getMonthsGrid( { columns: 4, format: 'short' } ) as months, id (id)}
																<DatePicker.TableRow>
																	{#each months as month, id (id)}
																		<DatePicker.TableCell value={month.value}>
																			<DatePicker.TableCellTrigger
																				>{month.label}</DatePicker.TableCellTrigger
																			>
																		</DatePicker.TableCell>
																	{/each}
																</DatePicker.TableRow>
															{/each}
														</DatePicker.TableBody>
													</DatePicker.Table>
												{/snippet}
											</DatePicker.Context>
										</DatePicker.View>
										<DatePicker.View view="year">
											<DatePicker.Context>
												{#snippet children(datePicker)}
													<DatePicker.ViewControl>
														<DatePicker.PrevTrigger />
														<DatePicker.ViewTrigger>
															<DatePicker.RangeText />
														</DatePicker.ViewTrigger>
														<DatePicker.NextTrigger />
													</DatePicker.ViewControl>
													<DatePicker.Table>
														<DatePicker.TableBody>
															{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
																<DatePicker.TableRow>
																	{#each years as year, id (id)}
																		<DatePicker.TableCell value={year.value}>
																			<DatePicker.TableCellTrigger
																				>{year.label}</DatePicker.TableCellTrigger
																			>
																		</DatePicker.TableCell>
																	{/each}
																</DatePicker.TableRow>
															{/each}
														</DatePicker.TableBody>
													</DatePicker.Table>
												{/snippet}
											</DatePicker.Context>
										</DatePicker.View>
									</DatePicker.Content>
								</DatePicker.Positioner>
							</Portal>
						</DatePicker>
					</div>

					<label class="label">
						<span class="text-sm font-medium opacity-80">Schedule Time</span>
						<select class="select" bind:value={formData.time}>
							{#each timeOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
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
