var zip_rests = {}
function create_location(data) {
  var newlocation = document.createElement('div');
  newlocation.classList.add('location');

  var city = document.createElement('h2');
  city.textContent = data['city_name'];
  newlocation.appendChild(city);
  console.log(data);
  for(let i = 0; i < data['restaurants'].length; i++) {
    var wrapper = document.createElement('div');
    var name = document.createElement('a');
    name.textContent = data['restaurants'][i]['rest_name'];
    name.setAttribute('href', '/reviews/' + data['restaurants'][i]['RestaurantID'])
    wrapper.appendChild(name);
    newlocation.appendChild(wrapper.cloneNode(true));
  }

  main_content = document.getElementById("locations-content");
  main_content.appendChild(newlocation);
}

function population_locations(data) {
  for(let i = 0; i < data['cities'].length; i++) {
    zip_rests[data['cities'][i]['Zipcode']] = {
      'city_name': data['cities'][i]['name'],
      'restaurants': []
    }
  }
  for(let i = 0; i < data['restaurants'].length; i++) {
    zip_rests[data['restaurants'][i]['Zipcode']]['restaurants'].push(data['restaurants'][i]);
  }

  for(key in zip_rests) {
    if(zip_rests[key]['restaurants'].length > 0) {
      create_location(zip_rests[key])
    }
  }
}

$.ajax({url: '/get_locations', type: 'GET', dataType: 'json', success: population_locations});
