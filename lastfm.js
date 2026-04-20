/**
  Rewritten for modern JS (No jQuery required)
*/
var lastfmData = {
  baseURL: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=",
  user: "Soulz0387",
  api_key: "6310ac1a53c3a3d532ec428346aca45a",
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
      var isPlaying = currentTrack["@attr"] && currentTrack["@"].nowplaying;
      
      // Simple image grab - no weird replacing that might break URLs
      var currentImg = currentTrack.image[2]["#text"];
      document.getElementById("tracktitle").innerHTML = currentTrack.name;
      document.getElementById("tracktitle").title = currentTrack.name + " by " + currentTrack.artist["#text"];
      
      // CORRECT LAST.FM TRACK URL: /music/Artist+Name/Track+Name
      var trackUrl = "https://www.last.fm/music/" + encodeURIComponent(currentTrack.artist["#text"]) + "/" + encodeURIComponent(currentTrack.name);
      document.getElementById("tracktitle").href = trackUrl;
      document.getElementById("tracktitle").setAttribute("data-tooltip", currentTrack.name + " by " + currentTrack.artist["#text"]);
      
      var artistUrl = "https://www.last.fm/music/" + encodeURIComponent(currentTrack.artist["#text"]);
      document.getElementById("trackartist").innerHTML = currentTrack.artist["#text"];
      document.getElementById("trackartist").href = artistUrl;
      
      // Album art tooltip & link
      var albumName = (currentTrack.album && currentTrack.album["#text"]) ? currentTrack.album["#text"] : "View on Last.fm";
      document.getElementById("trackart-link").href = trackUrl;
      document.getElementById("trackart-link").setAttribute("data-tooltip", albumName);
      document.getElementById("trackart").src = currentImg; // Put this back to exactly how it was when it worked!
      
      var artContainer = document.querySelector('.nowplayingcontainer-inner');
      if(artContainer) {
          artContainer.style.opacity = isPlaying ? '1' : '0.7';
      }

      // 2. UPDATE RECENT HISTORY LIST (Original Layout Restored)
      var list = document.getElementById("lastfm-history");
      var historyHtml = '';

      for (var i = 1; i < tracks.length; i++) {
        var item = tracks[i];
        
        // CORRECT LAST.FM TRACK URL
        var historyTrackUrl = "https://www.last.fm/music/" + encodeURIComponent(item.artist["#text"]) + "/" + encodeURIComponent(item.name);

        var historyImg = item.image[2]["#text"];

        historyHtml += '<a href="' + historyTrackUrl + '" target="_blank" class="flex items-center gap-3 hover:opacity-80 transition-opacity">';
        historyHtml += '<img src="' + historyImg + '" class="w-12 h-12 rounded object-cover border border-white/10 flex-shrink-0">';
        historyHtml += '<div class="min-w-0 flex-1">';
        historyHtml += '<p class="text-xs text-white font-bold truncate" style="font-size: 14px; font-weight: bold; line-height: 15px; letter-spacing: 0.2px; padding: 8px 0 0 4px;">' + item.name + '</p>';
        historyHtml += '<p class="text-gray-400 truncate" style="font-size: 12px; padding: 4px 0 0 4px;">' + item.artist["#text"] + '</p>';
        historyHtml += '</div>';
        historyHtml += '</a>';
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

// Start the countdown.
getSetLastFM();
// Refresh every 10 seconds
setInterval(getSetLastFM, 10 * 1000);