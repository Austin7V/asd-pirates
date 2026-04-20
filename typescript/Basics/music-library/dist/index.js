"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
type TrackId = number;
type ArtistName = string;

/!*type Track = {
    id: TrackId;
    title: string;
    artist: ArtistName;
    liked: boolean;
};*!/

interface Media {
    id: number;
    title: string;
}

interface Track extends Media {
    artist: string;
    liked: boolean;
}

interface FeaturedTrack extends Track {
    curatedBy: string;
    readonly addedDate: string;
}

function describeTrack(track: Track): string {
    return `${track.title} by ${track.artist} is ${track.liked}`;
}

const tracks: Track[] = [
    { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
    { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

console.log(describeTrack(tracks[0]));

const label = "My Library";
const trackCount = tracks.length;

function formatId(id: number): string {
    return `TRK-${id}`;
}

const ids = tracks.map((t) => formatId(t.id));
console.log(ids, label, trackCount);

const pick: FeaturedTrack = {
    id: 3,
    title: "Golden",
    artist: "Jill Scott",
    liked: true,
    curatedBy: "editorial",
    addedDate: "2024-01-15",
};

console.log(`${pick.title} — featured since ${pick.addedDate}`);
*/
//# sourceMappingURL=index.js.map