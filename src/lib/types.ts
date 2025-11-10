export interface Post {
    postId: string;
    caption: string | null;
    photocard: {
        url: string;
    } | null;
    schedule: {
        timestamp: string | null;
    } | null;
};
