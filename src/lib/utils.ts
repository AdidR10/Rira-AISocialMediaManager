import type { Post } from "$lib/types";

export const formatDate = (timestamp: string | null | undefined): string => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export const formatDateOnly = (timestamp: string | null | undefined): string => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export const formatTimeOnly = (timestamp: string | null | undefined): string => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export const getTimeRemaining = (
    timestamp: string,
    currentTime: number
): { text: string; class: string } => {
    const postTime = parseInt(timestamp);
    const diffSeconds = postTime - currentTime;
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 1) {
        return { text: `${diffDays} days`, class: 'badge preset-tonal-success' };
    } else if (diffDays === 1) {
        return { text: 'Tomorrow', class: 'badge preset-tonal-success' };
    } else if (diffHours > 1) {
        return { text: `${diffHours} hours`, class: 'badge preset-tonal-warning' };
    } else if (diffHours === 1) {
        return { text: '1 hour', class: 'badge preset-tonal-warning' };
    } else if (diffMinutes > 0) {
        return { text: `${diffMinutes} min`, class: 'badge preset-tonal-error' };
    } else {
        return { text: 'Now', class: 'badge preset-tonal-error' };
    }
}

export const categorizePosts = (posts: Post[], currentTime: number) => {
    const pastPosts = posts.filter((post) => {
        const timestamp = post.schedule?.timestamp;
        return timestamp && parseInt(timestamp) < currentTime;
    });

    const upcomingPosts = posts.filter((post) => {
        const timestamp = post.schedule?.timestamp;
        return timestamp && parseInt(timestamp) >= currentTime;
    });

    const unscheduledPosts = posts.filter((post) => !post.schedule?.timestamp);

    return { pastPosts, upcomingPosts, unscheduledPosts };
}