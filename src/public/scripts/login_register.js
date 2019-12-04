function refresh_page(data) {
  location.reload(true);
}

function failed(data) {
  failedDiv = document.getElementById("error_field");
  console.log(data);
  failedDiv.textContent = data["responseText"];
}

document.getElementById('login_button').addEventListener('click',
function() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  json_to_send = {"username": username, "password": password};
  $.ajax({
    url: '/login',
    type: 'POST',
    data: json_to_send,
    success: refresh_page,
    error: failed});
});

document.getElementById('register_button').addEventListener('click',
function() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  json_to_send = {"username": username, "password": password};
  $.ajax({
    url: '/register',
    type: 'POST',
    data: json_to_send,
    sucess: refresh_page,
    error: failed});
});
