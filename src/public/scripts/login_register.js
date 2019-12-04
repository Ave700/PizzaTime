function logged_in(data) {
  console.log('logged in');
}

function registered(data) {
  console.log('registered');
}

function failed(data) {
  failedDiv = document.getElementById("error_field");
  console.log(data);
  failedDiv.textContent = data["responseText"];
}

document.getElementById('login_button').addEventListener('click',
function() {
  let username = document.getElementById('username').value;
  let password = md5(document.getElementById('password').value);
  json_to_send = {"username": username, "password": password};
  $.ajax({
    url: '/login',
    type: 'POST',
    data: json_to_send,
    success: logged_in,
    error: failed});
});

document.getElementById('register_button').addEventListener('click',
function() {
  let username = document.getElementById('username').value;
  let password = md5(document.getElementById('password').value);
  json_to_send = {"username": username, "password": password};
  $.ajax({
    url: '/register',
    type: 'POST',
    data: json_to_send,
    success: registered,
    error: failed});
});
