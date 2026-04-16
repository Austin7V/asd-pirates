const friends = [
  {
    username: "David",
    status: "online",
    lastActivity: 10,
  },
  {
    username: "Lucy",
    status: "offline",
    lastActivity: 22,
  },
  {
    username: "Bob",
    status: "online",
    lastActivity: 104,
  },
];

//console.log(friends);

function onlineStatus(friends) {
  //ich brauche ein leeres Objekt wo wird zukunft information über denn status Freunde gespeicher
  const result = {};
  //ich muss jededen einzeln Freudn ansehen und
  for (const friend of friends) {
    //prüfen zuers ob er schon offline ist
    if (friend.status === "offline") {
      // und falls er noch nicht exixtiert muss ich ins neue Array dass er offline anliegen
      if (!result.offline) {
        result.offline = [];
      }
      //ich muss dass resultat abspeihern in richtige kategorie offline!
      result.offline.push(friend.username);
    } else if (friend.status === "online" && friend.lastActivity > 10) {
      if (!result.away) {
        result.away = [];
      }
      result.away.push(friend.username);
    } else {
      if (!result.online) {
        result.online = [];
      }
      result.online.push(friend.username);
    }
  }
  return result;
}

console.log(onlineStatus(friends));
