var lastfmData = {
  baseURL: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=",
  user: "Soulz0387",
  api_key: "6d7a76c0f2d28cf892c49b830a91a522",
  additional: "&format=json&limit=1"
};

var getSetLastFM = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", lastfmData.baseURL + lastfmData.user + "&api_key=" + lastfmData.api_key + lastfmData.additional, true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      var recentTrack = resp.recenttracks.track[0];
      
      if (recentTrack) {
        var formatted = recentTrack.name;
        document.getElementById("tracktitle").innerHTML = formatted;
        document.getElementById("tracktitle").href = recentTrack.url;
        document.getElementById("tracktitle").title = recentTrack.name + " by " + recentTrack.artist["#text"];
        document.getElementById("tracktitle").target = "_blank";

        document.getElementById("trackartist").innerHTML = recentTrack.artist["#text"];
        document.getElementById("trackartist").title = "Artist : " + recentTrack.artist["#text"];
        document.getElementById("trackart").src = recentTrack.image[2]["#text"];
      } else {
        document.getElementById("tracktitle").innerHTML = "Silence!";
        document.getElementById("trackart").src = "https://i.imgur.com/Q6cCswP.jpg";
        document.getElementById("trackartist").innerHTML = "Nothing playing";
      }
    }
  };
  
  xhr.onerror = function() {
    document.getElementById("tracktitle").innerHTML = "Silence!";
    document.getElementById("trackart").src = "https://i.imgur.com/Q6cCswP.jpg";
    document.getElementById("trackartist").innerHTML = "Failed to load";
  };
  
  xhr.send();
};

// Get the new one.
getSetLastFM();
// Start the countdown.
setInterval(getSetLastFM, 10 * 1000);