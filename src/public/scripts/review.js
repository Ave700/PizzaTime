function refresh_page(data) {
  location.reload(true);
}

function failed(data) {
  failedDiv = document.getElementById("error_field");
  failedDiv.textContent = data["responseText"];
}

document.getElementById('post-review').addEventListener('click',
function() {
  let data_to_send = {}
  data_to_send['text'] = document.getElementById('new-review').value;
  data_to_send['rating'] = document.getElementById('rating-input').value;
  console.log(data_to_send);
  $.ajax({
    url: '/post_review/' + location.pathname.split('/')[location.pathname.split('/').length - 1],
    type: 'POST',
    data: data_to_send,
    success: refresh_page,
    error: failed});
});
