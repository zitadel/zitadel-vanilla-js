$(document).ready(async () => {
  initAuth();
  // Get the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Retrieve 'code' and 'state' from the URL query string
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code && state) {
    await handleCallback(code, state);
  }

  updateUI();

  $("#login").click(async () => {
    login();
  });


  $("#logout").click(async () => {
    logout();
  });

  $("#silent-auth").click(async () => {
    silentAuthentication();
  });

  $(".copy-btn").on("click", async function () {
    const targetName = $(this).data("target");
    console.log(targetName);
    const user = await getUser();
    const text = user[targetName];
    const $btn = $(this);

    navigator.clipboard.writeText(text).then(() => {
      $btn.removeClass("text-primary").addClass("text-success");
      setTimeout(() => {
        $btn.removeClass("text-success").addClass("text-primary");
      }, 1500);
    });
  });

});

const updateUI = async () => {
  const user = await getUser();
  if (user) {
    $('#login').hide();
    $('#logout').show();
    $('.copy-btn').show();
    // Set the JWT token in the display box
    document.getElementById('access-token').textContent = JSON.stringify(decodeJWT(user.access_token), null, 2);
    document.getElementById('id-token').textContent = JSON.stringify(decodeJWT(user.id_token), null, 2);
    // Show the refresh token section only if a refresh token is present
    if (user.refresh_token) {
      $('#refresh-token-box').show();
      document.getElementById('refresh-token').textContent = user.refresh_token;
    } else {
      $('#refresh-token-box').hide();
    }
  } else {
    $('.copy-btn').hide();
    $('#login').show();
    $('#logout').hide();
  }
}