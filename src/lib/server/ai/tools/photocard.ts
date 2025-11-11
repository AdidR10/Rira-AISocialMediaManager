
export const Rand = () => {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
        .replace(/[+/=]/g, '');
}
