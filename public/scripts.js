(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      var aToken = document.getElementById("a-token");
      var rToken = document.getElementById("r-token");
      aToken.innerHTML = access_token
      rToken.innerHTML = refresh_token

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            console.log(response)
            var infoHeader = document.getElementById("info-header")
            infoHeader.innerHTML += `<img class='cropped' src="${response["images"][0]["url"]}" />`
            infoHeader.innerHTML += " " + response["display_name"]

            $('#login').hide();
            $('#loggedin').show();
          }
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            console.log(response);
            var topTracks = document.getElementById("top-tracks");
            for (let i = 0; i < 20; i++)
            {
              topTracks.innerHTML += 
              `<li onclick="location.href='${response["items"][i]['uri']}';" class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">${response["items"][i]["name"]}</div>
                ${response["items"][i]["artists"][0]["name"]}
              </div>
            </li>`
            }
          }
      });            

    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        var aToken1 = document.getElementById("a-token");
        var rToken1 = document.getElementById("r-token");
        aToken1.innerHTML = access_token
        rToken1.innerHTML = refresh_token
      });
    }, false);
  }
})();