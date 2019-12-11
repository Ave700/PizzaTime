function refresh_page(data) {
  location.reload(true);
}

function failed_top(data) {
  failedDiv = document.getElementById("error_top");
  failedDiv.textContent = data["responseText"];
}

function failed_rest(data) {
  failedDiv = document.getElementById("error_rest");
  failedDiv.textContent = data["responseText"];
}

function failed_pizza(data) {
  failedDiv = document.getElementById("error_pizza");
  failedDiv.textContent = data["responseText"];
}

update_toppings = document.getElementsByClassName('UpdateTopping');
for(let i = 0; i < update_toppings.length; i++) {
  let but = update_toppings[i];
  but.addEventListener('click',
  function(el) {
    let up_but = el.target;
    new_top = up_but.parentElement.parentElement.children[0].firstElementChild.value;
    new_price = up_but.parentElement.parentElement.children[1].firstElementChild.value;
    let data = {}
    data['name'] = new_top;
    data['price'] = new_price;
    let pk = up_but.attributes.pk.value;
    $.ajax({
      url: '/topping/update/' + pk,
      type: 'POST',
      data: data,
      success: refresh_page,
      error: failed_top});
  });
}
delete_toppings = document.getElementsByClassName('DeleteTopping');
for(let i = 0; i < delete_toppings.length; i++) {
  let but = delete_toppings[i];
  but.addEventListener('click',
  function(el) {
    let pk = el.target.attributes.pk.value;
    $.ajax({
      url: '/topping/delete/' + pk,
      type: 'POST',
      success: refresh_page,
      error: failed_top});
  });
}
insert_topping = document.getElementById('UpdateFirst');
insert_topping.addEventListener('click',
function() {
  let top_name = insert_topping.parentElement.parentElement.children[0].firstElementChild.value;
  let top_price = insert_topping.parentElement.parentElement.children[1].firstElementChild.value;
  let data = {}
  data['name'] = top_name;
  data['price'] = top_price;
  $.ajax({
    url: '/topping/insert',
    type: 'POST',
    data: data,
    success: refresh_page,
    error: failed_top});
});

update_rests = document.getElementsByClassName('UpdateRestaurant');
for(let i = 0; i < update_rests.length; i++) {
  let but = update_rests[i];
  but.addEventListener('click',
  function(el) {
    let up_but = el.target;
    new_name = up_but.parentElement.parentElement.children[0].firstElementChild.value;
    new_add = up_but.parentElement.parentElement.children[1].firstElementChild.value;
    new_zip = up_but.parentElement.parentElement.children[2].firstElementChild.value;
    new_phone = up_but.parentElement.parentElement.children[3].firstElementChild.value;
    let data = {}
    data['rest_name'] = new_name;
    data['Address'] = new_add;
    data['PhoneNumber'] = new_phone;
    data['Zipcode'] = new_zip;
    $.ajax({
      url: '/restaurant/update/' + up_but.attributes.pk.value,
      type: 'POST',
      data: data,
      success: refresh_page,
      error: failed_rest});
  });
}
delete_rests = document.getElementsByClassName('DeleteRestaurant');
for(let i = 0; i < delete_rests.length; i++) {
  let but = delete_rests[i];
  but.addEventListener('click',
  function(el) {
    let pk = el.target.attributes.pk.value;
    $.ajax({
      url: '/restaurant/delete/' + pk,
      type: 'POST',
      success: refresh_page,
      error: failed_rest});
  });
}
insert_restaurant = document.getElementById('UpdateSecond');
insert_restaurant.addEventListener('click',
function() {
  let rest_name = insert_restaurant.parentElement.parentElement.children[0].firstElementChild.value;
  let rest_add = insert_restaurant.parentElement.parentElement.children[1].firstElementChild.value;
  let rest_zip = insert_restaurant.parentElement.parentElement.children[2].firstElementChild.value;
  let rest_phone = insert_restaurant.parentElement.parentElement.children[2].firstElementChild.value;
  let data = {}
  data['Address'] = rest_add;
  data['PhoneNumber'] = rest_phone;
  data['rest_name'] = rest_name;
  data['Zipcode'] = rest_zip;
  $.ajax({
    url: '/restaurant/insert',
    type: 'POST',
    data: data,
    success: refresh_page,
    error: failed_rest});
});

update_pizzas = document.getElementsByClassName('UpdatePizza');
for(let i = 0; i < update_pizzas.length; i++) {
  let but = update_pizzas[i];
  but.addEventListener('click',
  function(el) {
    let up_but = el.target;
    new_name = up_but.parentElement.parentElement.children[1].firstElementChild.value;
    new_crust = up_but.parentElement.parentElement.children[2].firstElementChild.value;
    new_size = up_but.parentElement.parentElement.children[3].firstElementChild.value;
    let data = {}
    data['name'] = new_name;
    data['CrustType'] = new_crust;
    data['Size'] = new_size;
    $.ajax({
      url: '/pizza/update/' + up_but.attributes.pk.value,
      type: 'POST',
      data: data,
      success: refresh_page,
      error: failed_pizza});
  });
}
delete_pizzas = document.getElementsByClassName('DeletePizza');
for(let i = 0; i < delete_pizzas.length; i++) {
  let but = delete_pizzas[i];
  but.addEventListener('click',
  function(el) {
    let pk = el.target.attributes.pk.value;
    $.ajax({
      url: '/pizza/delete/' + pk,
      type: 'POST',
      success: refresh_page,
      error: failed_pizza});
  });
}
insert_pizza = document.getElementById('UpdateThird');
insert_pizza.addEventListener('click',
function() {
  let pizza_name = insert_pizza.parentElement.parentElement.children[1].firstElementChild.value;
  let pizza_crust = insert_pizza.parentElement.parentElement.children[2].firstElementChild.value;
  let pizza_size = insert_pizza.parentElement.parentElement.children[3].firstElementChild.value;
  let data = {}
  data['CrustType'] = pizza_crust;
  data['name'] = pizza_name;
  data['Size'] = pizza_size;
  $.ajax({
    url: '/pizza/insert',
    type: 'POST',
    data: data,
    success: refresh_page,
    error: failed_pizza});
});
