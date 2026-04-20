"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_js_1 = require("./types.js");
const libraryName = "Late Night Listening";
function describeTrack(track) {
    return `${track.title} by ${track.artist}`;
}
const tracks = [
    { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
    { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];
const pick = {
    id: 3,
    title: "Golden",
    artist: "Jill Scott",
    liked: true,
    curatedBy: "editorial",
    addedDate: "2024-01-15",
};
console.log(`Library: ${libraryName}`);
console.log(describeTrack(tracks[0]));
tracks.forEach((t) => console.log((0, types_js_1.formatId)(t.id)));
console.log(`Featured: ${pick.title} — added ${pick.addedDate}`);
//# sourceMappingURL=main.js.map