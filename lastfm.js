var lastfmData = {
  baseURL: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=",
  user: "Soulz0387",
  api_key: "6d7a76c0f2d28cf892c49b830a91a522",
  additional: "&format=json&limit=5"
};

var getSetLastFM = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", lastfmData.baseURL + lastfmData.user + "&api_key=" + lastfmData.api_key + lastfmData.additional, true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      var tracks = resp.recenttracks.track;
      
      if (!tracks || tracks.length === 0) return;
      
      // 1. UPDATE NOW PLAYING (Top Card)
      var currentTrack = tracks[0];
      var isPlaying = currentTrack["@attr"] && currentTrack["@attr"].nowplaying;
      
      var currentImg = currentTrack.image[2]["#text"];
      if (currentImg.includes("/300x300/")) {
          currentImg = currentImg.replace("/300x300/", "/64s/");
      }

      document.getElementById("tracktitle").innerHTML = currentTrack.name;
      
      // --- TOOLTIP & LINKS ---
      var albumName = "Unknown Album";
      var trackUrl = "#";
      var artistUrl = "#";

      // Try to get Spotify URL (Priority)
      if(currentTrack.url && currentTrack.url.includes("open.spotify.com")) {
          trackUrl = currentTrack.url;
          artistUrl = currentTrack.url.split("/track/")[0] + "/artist/" + encodeURIComponent(currentTrack.artist["#text"]);
          albumName = currentTrack.album["#text"] || "View on Spotify";
      } 
      // Fallback to Last.fm URL
      else {
          trackUrl = "https://www.last.fm/user/" + lastfmData.user + "/library/tracks/" + encodeURIComponent(currentTrack.mbid);
          artistUrl = "https://www.last.fm/music/" + encodeURIComponent(currentTrack.artist["#text"]);
          albumName = currentTrack.album["#text"] || "View on Last.fm";
      }

      document.getElementById("tracktitle").title = currentTrack.name + " by " + currentTrack.artist["#text"];
      document.getElementById("tracktitle").href = trackUrl;
      document.getElementById("trackartist").innerHTML = currentTrack.artist["#text"];
      document.getElementById("trackartist").title = "Artist: " + currentTrack.artist["#text"];
      document.getElementById("trackartist").href = artistUrl;
      document.getElementById("trackart").src = currentImg;
      
      // Set Tooltips
      document.getElementById("trackart-link").setAttribute("data-tooltip", albumName);
      document.getElementById("tracktitle").setAttribute("data-tooltip", currentTrack.name + " by " + currentTrack.artist["#text"]);
      document.getElementById("trackartist").setAttribute("data-tooltip", "Artist: " + currentTrack.artist["#text"]);
      
      var artContainer = document.querySelector('.nowplayingcontainer-inner');
      if(artContainer) {
          artContainer.style.opacity = isPlaying ? '1' : '0.7';
      }

      // 2. UPDATE RECENT HISTORY LIST
      var list = document.getElementById("lastfm-history");
      var historyHtml = '';

      for (var i = 1; i < tracks.length; i++) {
        var item = tracks[i];

        var historyImg = item.image[2]["#text"];
        if (historyImg.includes("/300x300/")) {
            historyImg = historyImg.replace("/300x300/", "/64s/");
        }

        historyHtml += '<div class="bg-black/20 p-3 border border-white/5 flex items-center gap-3">';
        historyHtml += '<img src="' + historyImg + '" class="w-10 h-10 rounded object-cover border border-white/10 flex-shrink-0">';
        historyHtml += '<div class="min-w-0 flex-1">';
        historyHtml += '<p class="text-xs text-white font-bold truncate">' + item.name + '</p>';
        historyHtml += '<p class="text-[10px] text-gray-400 truncate">' + item.artist["#text"] + '</p>';
        historyHtml += '</div>';
        historyHtml += '</div>';
      }
      
      if(list) list.innerHTML = historyHtml;
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