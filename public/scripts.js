var params;
var access_token;
var refresh_token;
var error;

function start() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g
    var q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  params = getHashParams();
  access_token = params.access_token
  refresh_token = params.refresh_token
  error = params.error;

  if (error) {
    alert('There was an error during the authentication');
    //console.log(error)
  } else {
    if (access_token) {
      document.getElementById('a-token').innerHTML = access_token;
      document.getElementById('r-token').innerHTML = refresh_token;

      $('#login').hide();
      $('#loggedin').show();
      $('#tracks-all').show();
      //$('#tracks-6').hide();
      //$('#tracks-last').hide();
      //$('#artists-all').hide();
      //$('#artists-6').hide();
      //$('#artists-last').hide();
      $('#tracks').show();
      $('#main').show();
      //$('#artists').hide();

      function getTopTracks(data, id) {
        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          data: {
            "time_range": data
          },
          success: function(response) {
            //console.log(response);
            for (let i = 0; i < 20; i++) {
              document.getElementById(id).innerHTML += 
              `
              <li onclick="location.href='${response['items'][i]['uri']}'" class='list-group-item d-flex align-items-start'>
              <div class='row'>
                <div class='col col-auto'>
                  <img class='cropped' src=${response['items'][i]['album']['images'][2]['url']}>
                </div>
                <div class='col col textsize'>
                  <div class='ms-2 me-auto'>
                    <div class='fw-bold'>${
                      ($(window).width() < 600) ? (!(response['items'][i]['name'][38]) ? response['items'][i]['name'].substring(0,37) : response['items'][i]['name'].substring(0,37) + "..."): response['items'][i]['name']
                    }</div>
                    ${response['items'][i]['artists'][0]['name']}
                  </div>
                </div>
              </div>

            </li>
            `
            }
          }
        }); 
      }

      function getTopArtists(data, id) {
        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/artists',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          data: {
            "time_range": data,
          },
          success: function(response) {
            //console.log(response);
            for (let i = 0; i < 20; i++) {
              document.getElementById(id).innerHTML += 
            `
            <li onclick="location.href='${response['items'][i]['uri']}'" class='list-group-item d-flex align-items-start'>
            <div class='row'>
              <div class='col col-auto'>
                <p> </p>
              </div>
              <div class='col col-auto'>
                <img class='cropped num-artists' src=${response['items'][i]['images'][2]['url']} height='64px' width='64px'>
              </div>
              <div class='col col-auto textsize'>
                <div class='ms-2 me-auto'>
                  <div class='fw-bold'>${response['items'][i]['name']}</div>
                </div>
              </div>
            </div>
          </li>
          `
            }
          }
        }); 
      }

      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          //console.log(response);
          for (let i = 0; i < 20; i++) {
            document.getElementById('recent-p').innerHTML += 
            `
            <li onclick="location.href='${response['items'][i]['track']['uri']}'" class='list-group-item d-flex align-items-start'>
            <div class='row'>
              <div class='col col-auto'>
                <img class='cropped' src=${response['items'][i]['track']['album']['images'][2]['url']}>
              </div>
              <div class='col col textsize'>
                <div class='ms-2 me-auto'>
                  <div class='fw-bold'>${
                    ($(window).width() < 768) ? (!(response['items'][i]['track']['name'][38]) ? response['items'][i]['track']['name'].substring(0,37) : response['items'][i]['track']['name'].substring(0,37) + "..."): response['items'][i]['track']['name']
                  }</div>
                  ${response['items'][i]['track']['artists'][0]['name']}
                </div>
              </div>
            </div>

          </li>
          `
          }
        }
      }); 

      getTopTracks('long_term', 'top-tracks-all') 
      getTopTracks('medium_term', 'top-tracks-6') 
      getTopTracks('short_term', 'top-tracks-last') 
      
      getTopArtists('long_term', 'top-artists-all') 
      getTopArtists('medium_term', 'top-artists-6') 
      getTopArtists('short_term', 'top-artists-last') 

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
      }).done(function(response) {
        document.getElementById('a-token').innerHTML = response.access_token
        document.getElementById('r-token').innerHTML = refresh_token;
      });
    }, false);
  }
}

function track() {
  $('#tracks').show();
  $('#tracks-all').show();
  $('#artists').hide();
  $('#recent').hide();
  $('#main').show();
}

function artist() {
  $('#tracks').hide();
  $('#artists').show();
  $('#artists-all').show();
  $('#recent').hide();
  $('#main').show();
}

function allt() {
  $('#tracks-6').hide();
  $('#tracks-last').hide();
  $('#artists-6').hide();
  $('#artists-last').hide();
  if (window.getComputedStyle(document.getElementById('tracks')).display !== 'none') {
    $('#tracks-all').show();
    $('#artists-all').hide();
  }
  else if (window.getComputedStyle(document.getElementById('artists')).display !== 'none') {
    $('#tracks-all').hide();
    $('#artists-all').show();
  }
}

function six() {
  $('#tracks-all').hide();
  $('#tracks-last').hide();
  $('#artists-all').hide();
  $('#artists-last').hide();
  if (window.getComputedStyle(document.getElementById('tracks')).display !== 'none') {
    $('#tracks-6').show();
    $('#artists-6').hide();
  }
  else if (window.getComputedStyle(document.getElementById('artists')).display !== 'none') {
    $('#tracks-6').hide();
    $('#artists-6').show();
  }
}

function last() {
  $('#tracks-all').hide();
  $('#tracks-6').hide();
  $('#artists-all').hide();
  $('#artists-6').hide();
  if (window.getComputedStyle(document.getElementById('tracks')).display !== 'none') {
    $('#tracks-last').show();
    $('#artists-last').hide();
  }
  else if (window.getComputedStyle(document.getElementById('artists')).display !== 'none') {
    $('#tracks-all').hide();
    $('#artists-last').show();
  }
}

function recent() {
  $('#tracks').hide();
  $('#artists').hide();
  $('#recent').show();
  $('#main').hide();
}