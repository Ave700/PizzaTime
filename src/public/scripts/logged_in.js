function refresh_page(data) {
  location.reload(true);
}

document.getElementById('logout_button').addEventListener('click',
function() {
  $.ajax({
    url: '/logout',
    type: 'GET',
    success: refresh_page});
});
