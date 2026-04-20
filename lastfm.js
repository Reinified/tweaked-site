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
      document.getElementById("tracktitle").title = currentTrack.name + " by " + currentTrack.artist["#text"];
      document.getElementById("trackartist").innerHTML = currentTrack.artist["#text"];
      document.getElementById("tracktitle").href = currentTrack.url || "#";
      document.getElementById("trackart").src = currentImg;
      
      var artContainer = document.querySelector('.nowplayingcontainer-inner');
      if(artContainer) {
          artContainer.style.opacity = isPlaying ? '1' : '0.7';
      }

      // 2. UPDATE RECENT HISTORY LIST (Skip the first track to avoid duplicates)
      var list = document.getElementById("lastfm-history");
      var historyHtml = '';

      for (var i = 1; i < tracks.length; i++) {
        var item = tracks[i];
        
        // Parse the timestamp safely (Last.fm sometimes sends it as a string)
        var uts = (item.date && item.date.uts) ? parseInt(item.date.uts) : Date.now();
        var timeAgo = getTimeAgo(uts);

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
        historyHtml += '<div class="text-right flex-shrink-0">';
        historyHtml += '<p class="text-[9px] text-gray-500">' + timeAgo + '</p>';
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

// Convert UNIX timestamp to "X min ago"
function getTimeAgo(timestamp) {
    var seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    return days + 'd ago';
}

// Get the new one.
getSetLastFM();
// Start the countdown.
setInterval(getSetLastFM, 10 * 1000);