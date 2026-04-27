import { getFavoriteIds } from "../utils/favorite";

export function renderFavoriteCount(
    favoriteCount: HTMLSpanElement | null = document.querySelector("#favorite-count")
) {
    if (!favoriteCount) {
        return;
    }
    favoriteCount.textContent = String(getFavoriteIds().length);
}