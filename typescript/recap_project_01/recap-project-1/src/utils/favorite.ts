const FAVORITES_KEY = "favoriteBookIds";

export function getFavoriteIds() {
    const storedFavoriteIds = localStorage.getItem(FAVORITES_KEY);
    if (!storedFavoriteIds) {
        return [];
    }
    const favoriteIds: string[] = JSON.parse(storedFavoriteIds);
    return favoriteIds;
}

export function saveFavoriteIds(favoriteIds: string[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
}

export function isFavorite(bookId: string) {
    const favoriteIds = getFavoriteIds();
    return favoriteIds.includes(bookId);
}

export function addFavoriteId(bookId: string) {
    const favoriteIds = getFavoriteIds();
    favoriteIds.push(bookId);
    saveFavoriteIds(favoriteIds);
}

export function removeFavoriteId(bookId: string) {
    const favoriteIds = getFavoriteIds();
    const updatedFavoriteIds = favoriteIds.filter((favoriteId) => {
        return favoriteId !== bookId;
    });

    saveFavoriteIds(updatedFavoriteIds);
}

export function toggleFavoriteId(bookId: string) {
    if (isFavorite(bookId)) {
        removeFavoriteId(bookId);
        return;
    }

    addFavoriteId(bookId);
}