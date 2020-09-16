var user = new Vue({
  el: '#register-form',
  data: {
    first_name: '',
    last_name: '',
    username: '',
    password1: '',
    password2: '',
    email: ''
  }
});


var userInfo = new Vue({
  el: '#main',
  data: {
    user_UID: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    address: 'Address',
    contact: 'Contact',
    postcode: 'Postcode',
    updatePassword: {
      password1: '',
      password2: '',
      password3: ''
    },
    img: '/images/user-image.png',
    user_auth_level: 0,
    tab: 0,
    resObj: [],
    bookObj: [],
    res_name: '',
    res_city: '',
    res_address: '',
    res_contact: '',
    res_id: 0,
    searchInfo: {
      min_date: '',
      time: '7.00 p.m',
      date: '',
      seats: 2,
      context: ''
    },
    updateProfile: {
      uid: 0,
      first: '',
      last: '',
      address: '',
      postcode: '',
      contact: '',
      email: ''
    },
    updateRes: {
      rid: 0,
      name: '',
      city: '',
      address: '',
      contact: '',
      seats: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      description: '',
      img: ''
    },
    blogPosts: [],
    uploadPosts: {
      marks: 1,
      content: ''
    },
    modify_index: 0
  }
});

Vue.component('restaurant', {
  props: ['name', 'city', 'address', 'contact', 'url', 'breakfast', 'lunch', 'dinner', 'resid', 'seats', 'description', 'modify'],
  template: '<div>\
  <div>\
    <div class="restaurant-details">\
      <img v-bind:src="url" alt="restaurant picture" class="restaurant-img" />\
      <span class="restaurant-info">\
        <span>Restaurant: {{ name }}</span>\
      </span>\
      <span class="restaurant-info">\
        <span>City: {{ city }}</span>\
      </span>\
      <span class="restaurant-info">\
        <p>Address: {{ address }}</p>\
        </span>\
        <span class="restaurant-info" style="width: 100%">\
          <p>Description: {{ description }}</p>\
        </span>\
    </div>\
    <div class="restaurant-details-right">\
      <span class="restaurant-info-right">\
        <span>Contact: {{ contact }}</span>\
      </span>\
      <span class="restaurant-info-right">\
        <span>Meal Provided: \
          <span v-if="breakfast" style="margin-left: 5px;">Breakfast</span>\
          <span v-if="lunch" style="margin-left: 5px;">Lunch</span>\
          <span v-if="dinner" style="margin-left: 5px;">Dinner</span>\
        </span>\
      </span>\
      <span class="restaurant-info-right">\
        <span>Available seats: {{ seats }}</span>\
      </span>\
    </div>\
    </div>\
    <div v-if="modify">\
      <button v-on:click="modifyRestaurant(resid);" style="margin-top: 10px">Edit</button>\
      <button v-on:click="removeRestaurant(resid);" style="margin-top: 10px">Remove</button>\
      <button v-on:click="bookingFromRestaurant(resid, name);" style="margin-top: 10px">Booking of this restaurant</button>\
    </div>\
    <div v-else>\
      <button v-on:click="bookTable(resid)" style="margin-top: 10px">Book now</button>\
      <button v-on:click="showPosts(resid, name)" style="margin-top: 10px">Reviews</button>\
    </div>\
    <hr />\
  </div>'
});

Vue.component('booking', {
  props: ['name', 'address', 'contact', 'url', 'resid', 'seats', 'time', 'date', 'nref'],
  template: '<div>\
  <div>\
    <div class="restaurant-details">\
      <img v-bind:src="url" alt="restaurant picture" class="restaurant-img" />\
      <span class="restaurant-info">\
        <span>Restaurant: {{ name }}</span>\
      </span>\
      <span class="restaurant-info">\
        <span>Date: {{ date }}</span>\
      </span>\
      <span class="restaurant-info">\
        <span>Time: {{ time }}</span>\
      </span>\
      <span class="restaurant-info">\
        <p>Address: {{ address }}</p>\
      </span>\
    </div>\
    <div class="restaurant-details-right">\
      <span class="restaurant-info-right">\
        <span>Pax: {{ seats }}</span>\
      </span>\
      <span class="restaurant-info-right">\
        <span>Contact: {{ contact }}</span>\
      </span>\
    </div>\
    </div>\
    <button v-on:click="manageBooking(nref, name, seats, date, time);" style="margin-top: 10px">Manage your booking</button>\
    <button v-on:click="cancelBooking(nref);" style="margin-top: 10px">Cancel booking</button>\
    <hr />\
  </div>'
});

Vue.component('orders', {
  props: ['name', 'contact', 'email', 'pax', 'time', 'date', 'order'],
  template: '<div>\
  <div>\
    <div class="restaurant-details" style="width: 330px">\
      <span class="restaurant-booking-info">\
        <span>Order Reference: #{{ order }}</span>\
      </span>\
      <span class="restaurant-booking-info">\
        <span>Customer Name: {{ name }}</span>\
      </span>\
      <span class="restaurant-booking-info">\
        <span>Customer Contact: {{ contact }}</span>\
      </span>\
      <span class="restaurant-booking-info">\
        <p>Customer Email: {{ email }}</p>\
      </span>\
    </div>\
    <div class="restaurant-details-right">\
      <span class="restaurant-info-right">\
        <span>Order\'s Pax Size: {{ pax }}</span>\
      </span>\
      <span class="restaurant-info-right">\
        <span>Date: {{ date }}</span>\
      </span>\
      <span class="restaurant-info-right">\
        <span>Time: {{ time }}</span>\
      </span>\
    </div>\
    </div>\
    <hr />\
  </div>'
});

Vue.component('posts', {
  props: ['name', 'date', 'time', 'content', 'img', 'marks'],
  template: '<div>\
  <div>\
    <div class="posts-user-details">\
      <div class="user-img-container-general" style="margin: 15px auto 0 auto;">\
        <img class="user-img" v-bind:src="img" alt="user-login" />\
      </div>\
        <span class="posts-user-name">{{ name }}</span>\
    </div>\
    <div class="posts details" style="margin-top: 20px">\
      <span style="color:grey;">{{ date }} at {{ time }}</span>\
    <span><span style="color:red;">Rating:</span> {{marks}}<i style="font-size:12px; color: yellow;" class="fas">&#xf005;</i></span>\
    </div>\
    <div class="posts-content"><p>{{content}}</p></div>\
  <hr />\
  </div>'
});

function showPosts(resid, name) {
  blogPosts = [];
  userInfo.res_id = resid;
  userInfo.res_name = name;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      var i;
      for (i = 0; i < userObj.length; i++) {
        let current_datetime = new Date(userObj[i].date);
        let day = current_datetime.getDate();
        day = (day < 10) ? "0" + day : day;
        let month = current_datetime.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;
        let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + day;
        userInfo.blogPosts.push({
          name: userObj[i].name,
          time: userObj[i].time,
          img: userObj[i].img,
          content: userObj[i].content,
          marks: userObj[i].marks,
          date: formatted_date
        });
      }
      swapTag(2);
    }
  };

  xhttp.open("GET", "/restaurant/reviews/list?rid=" + resid, true);

  xhttp.send();
}

function leaveReview(){
  userInfo.uploadPosts.name = userInfo.first_name + ' ' + userInfo.last_name;
  var d = new Date();
  userInfo.uploadPosts.date = d.toISOString().substr(0, 10);
  userInfo.uploadPosts.time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  userInfo.uploadPosts.rid = userInfo.res_id;
  userInfo.uploadPosts.img = userInfo.img;
  userInfo.uploadPosts.marks = parseInt(userInfo.uploadPosts.marks);

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload();
    }
  };

  xhttp.open("POST", "/reviews/add.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userInfo.uploadPosts));
}

function onSignIn(googleUser) {
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      googleUser.disconnect();
      window.location.assign("/users/profile.html");
    }
  };

  xhttp.open("POST", "/login.json", true);

  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhttp.send('idtoken=' + id_token);
}

function signOut() {
  var xhttp = new XMLHttpRequest;

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.replace('/');
    }
  }

  xhttp.open('GET', '/users/logout', true);

  xhttp.send();
}

function bookingFromRestaurant(resid, name) {
  userInfo.bookObj = [];

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      userInfo.res_name = name;
      var i;
      for (i = 0; i < userObj.length; i++) {
        let current_datetime = new Date(userObj[i].date);
        let day = current_datetime.getDate();
        day = (day < 10) ? "0" + day : day;
        let month = current_datetime.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;
        let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + day;
        userInfo.bookObj.push({
          name: userObj[i].first_name + userObj[i].last_name,
          contact: userObj[i].phone,
          email: userObj[i].email,
          pax: userObj[i].pax,
          time: timeConvert(userObj[i].time),
          order_ref: userObj[i].REF,
          date: formatted_date
        });
      }
      swapTag(11);
    }
  };

  xhttp.open("GET", "/users/restaurant/booking?rid=" + resid, true);

  xhttp.send();
}

function updatePassword() {
  if (!userInfo.updatePassword.password2 === userInfo.updatePassword.password3) {
    alert("New passwords not match");
  } else {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        alert("Your password has been successfully changed");
        alert("You have been logged out");
        window.location.assign('/users/logout');
      } else if (this.readyState == 4 && this.status >= 400) {
        alert(JSON.parse(this.responseText).error);
      }
    };

    xhttp.open("POST", "/users/password", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send(JSON.stringify({
      password_new: userInfo.updatePassword.password2,
      password_old: userInfo.updatePassword.password1,
      uid: userInfo.user_UID
    }));
  }
}

var map, infoWindow, marker;
var res_location = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 14
  });

  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Your location');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Try HTML5 geolocation.
  loadSearchResult();
}

function geocodeAddress(address, resultsMap) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status === 'OK') {
      marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: resultsMap
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function cancelBooking(ref) {
  if (!confirm("Are you sure to cancel booking?")) return;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.assign('/users/profile.html');
    }
  };

  xhttp.open("GET", "/users/booking/remove?ref=" + ref, true);

  xhttp.send();
}

function modifyRestaurant(n_RID) {
  var i;
  for (i = 0; i < userInfo.resObj.length; i++) {
    if (userInfo.resObj[i].res_RID === n_RID) break;
  }
  userInfo.modify_index = i;
  userInfo.updateRes.name = userInfo.resObj[i].res_name;
  userInfo.updateRes.city = userInfo.resObj[i].res_city;
  userInfo.updateRes.address = userInfo.resObj[i].res_address;
  userInfo.updateRes.contact = userInfo.resObj[i].res_contact;
  userInfo.updateRes.seats = userInfo.resObj[i].seats;
  userInfo.updateRes.breakfast = userInfo.resObj[i].meal.breakfast;
  userInfo.updateRes.lunch = userInfo.resObj[i].meal.lunch;
  userInfo.updateRes.dinner = userInfo.resObj[i].meal.dinner;
  userInfo.updateRes.rid = userInfo.resObj[i].res_RID;
  userInfo.updateRes.description = userInfo.resObj[i].description;
  userInfo.updateRes.img = userInfo.resObj[i].res_image;
  userInfo.tab = 7;
}

function updateProfile() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.assign("/users/profile.html");
    }
  };

  xhttp.open("POST", "/users/modify.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userInfo.updateProfile));
}

function removeRestaurant(n_RID) {
  if (!confirm("Are you sure to remove this restaurant from your account?")) return;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.assign('/users/profile.html');
    }
  };

  xhttp.open("GET", "/users/restaurant/remove?rid=" + n_RID, true);

  xhttp.send();
}

function setDefaultDate() {
  var d = new Date();
  userInfo.searchInfo.date = userInfo.searchInfo.min_date = d.toISOString().substr(0, 10);
}

function register() {
  if (user.password1 !== user.password2) {
    alert("Password doesn't match");
  } else {
    var userObj = {
      username: user.username,
      password: user.password1,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    };

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        loadUserPage();
        location.assign("/");
      } else if (this.readyState == 4 && this.status == 500) {
        alert(JSON.parse(this.responseText).error);
        user.password1 = user.password2 = "";
      }
    };

    xhttp.open("POST", "/register.json", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send(JSON.stringify(userObj));
  }
}

function loadUserPage() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      userInfo.first_name = userObj.first_name;
      userInfo.last_name = userObj.last_name;
      userInfo.username = userObj.username;
      userInfo.email = userObj.email;
      userInfo.user_auth_level = userObj.auth_level;
      userInfo.user_UID = userObj.UID;
      userInfo.img = userObj.img;
      userInfo.address = userObj.address != null ? userObj.address : userInfo.address;
      userInfo.contact = userObj.phone != null ? userObj.phone : userInfo.contact;
      userInfo.postcode = userObj.postcode != null ? userObj.postcode : userInfo.postcode;
    }
  };

  xhttp.open("GET", "/users", true);

  xhttp.send();
}

function login() {
  var userObj = {
    username: user.username,
    password: user.password1
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.assign("/users/profile.html");
    } else if (this.readyState == 4 && this.status >= 400) {
      alert(JSON.parse(this.responseText).error);
      location.reload();
    }
  };

  xhttp.open("POST", "/login.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userObj));
}

function swapTag(n_tab) {
  if (!userInfo.user_auth_level) {
    window.location.assign("/");
    return;
  }
  userInfo.tab = n_tab;
  if (n_tab === 3 && userInfo.user_auth_level === 2) {
    showRestaurant();
  } else if (n_tab === 1) {
    listBooking();
  } else if (n_tab === 10) {
    userInfo.updateProfile.uid = userInfo.user_UID;
    userInfo.updateProfile.first = userInfo.first_name;
    userInfo.updateProfile.last = userInfo.last_name;
    userInfo.updateProfile.address = userInfo.address;
    userInfo.updateProfile.contact = userInfo.contact;
    userInfo.updateProfile.postcode = userInfo.postcode;
    userInfo.updateProfile.email = userInfo.email;
  }
}

function addRestaurant() {
  if (!userInfo.user_UID) {
    alert("Session invalid");
    window.location.assign('/');
    return;
  }

  var userObj = {
    res_name: userInfo.res_name,
    res_city: userInfo.res_city,
    res_address: userInfo.res_address,
    res_contact: userInfo.res_contact,
    user_UID: userInfo.user_UID
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("Register Complete!");
      location.reload();
    }
  };

  xhttp.open("POST", "/users/restaurant/add.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userObj));
}

function showRestaurant() {
  if (userInfo.resObj.length !== 0 || !userInfo.user_UID) return;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      var i;
      for (i = 0; i < userObj.length; i++) {
        userInfo.resObj.push({
          res_RID: userObj[i].RID,
          res_name: userObj[i].res_name,
          res_city: userObj[i].city,
          res_address: userObj[i].res_address,
          res_contact: userObj[i].res_contact,
          seats: userObj[i].seats,
          meal: {
            breakfast: userObj[i].breakfast,
            lunch: userObj[i].lunch,
            dinner: userObj[i].dinner
          },
          img: userObj[i].image,
          description: userObj[i].description,
          modify: true
        });
      }
    }
  };

  xhttp.open("GET", "/users/restaurant/list?uid=" + userInfo.user_UID, true);

  xhttp.send();
}

function updateRestaurant() {
  if (!userInfo.user_UID) {
    alert("Session invalid");
    window.location.assign('/');
    return;
  }

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("Edit Complete!");
      window.location.assign("/users/profile.html");
    }
  };

  xhttp.open("POST", "/users/restaurant/modify.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userInfo.updateRes));
}

function loadSearchResult() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });

  userInfo.searchInfo.date = vars['date'];
  userInfo.searchInfo.time = vars['time'];
  userInfo.searchInfo.time = userInfo.searchInfo.time.replace('+', ' ');
  userInfo.searchInfo.seats = parseInt(vars['people']);
  userInfo.searchInfo.context = vars['text'];
  var new_time = timeConvert(userInfo.searchInfo.time);
  res_location = [];

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      var i;
      for (i = 0; i < userObj.length; i++) {
        userInfo.resObj.push({
          res_RID: userObj[i].RID,
          res_name: userObj[i].res_name,
          res_city: userObj[i].city,
          res_address: userObj[i].res_address,
          res_contact: userObj[i].res_contact,
          img: userObj[i].image,
          seats: userObj[i].seats,
          meal: {
            breakfast: userObj[i].breakfast,
            lunch: userObj[i].lunch,
            dinner: userObj[i].dinner
          },
          description: userObj[i].description,
          modify: false
        });
        res_location.push(userObj[i].res_address);
      }

      for (i = 0; i < res_location.length; i++) {
        geocodeAddress(res_location[i], map);
      }
    }
  };

  xhttp.open("GET", "/search?date=" + userInfo.searchInfo.date +
    "&time=" + new_time + "&people=" + userInfo.searchInfo.seats +
    "&text=" + userInfo.searchInfo.context, true);

  xhttp.send();
}

function bookTable(resid) {
  var i;
  for (i = 0; i < userInfo.resObj.length; i++) {
    if (userInfo.resObj[i].res_RID === resid) break;
  }
  userInfo.modify_index = i;
  userInfo.updateRes.name = userInfo.resObj[i].res_name;
  userInfo.updateRes.rid = userInfo.resObj[i].res_RID;
  userInfo.tab = 1;
}

function timeConvert(time) {
  var result;
  if (typeof time == "number") {
    switch (time) {
      case 7:
        result = "7.00 a.m";
        break;
      case 8:
        result = "8.00 a.m";
        break;
      case 9:
        result = "9.00 a.m";
        break;
      case 10:
        result = "10.00 a.m";
        break;
      case 11:
        result = "11.00 a.m";
        break;
      case 12:
        result = "12.00 p.m";
        break;
      case 13:
        result = "1.00 p.m";
        break;
      case 14:
        result = "2.00 p.m";
        break;
      case 15:
        result = "3.00 p.m";
        break;
      case 16:
        result = "4.00 p.m";
        break;
      case 17:
        result = "5.00 p.m";
        break;
      case 18:
        result = "6.00 p.m";
        break;
      case 19:
        result = "7.00 p.m";
        break;
      case 20:
        result = "8.00 p.m";
        break;
      case 21:
        result = "9.00 p.m";
        break;
      case 22:
        result = "10.00 p.m";
        break;
      case 23:
        result = "11.00 p.m";
        break;
    }
  } else {
    switch (time) {
      case '7.00 a.m':
        result = 7;
        break;
      case '8.00 a.m':
        result = 8;
        break;
      case '9.00 a.m':
        result = 9;
        break;
      case '10.00 a.m':
        result = 10;
        break;
      case '11.00 a.m':
        result = 11;
        break;
      case '12.00 a.m':
        result = 12;
        break;
      case '1.00 p.m':
        result = 13;
        break;
      case '2.00 p.m':
        result = 14;
        break;
      case '3.00 p.m':
        result = 15;
        break;
      case '4.00 p.m':
        result = 16;
        break;
      case '5.00 p.m':
        result = 17;
        break;
      case '6.00 p.m':
        result = 18;
        break;
      case '7.00 p.m':
        result = 19;
        break;
      case '8.00 p.m':
        result = 20;
        break;
      case '9.00 p.m':
        result = 21;
        break;
      case '10.00 p.m':
        result = 22;
        break;
      case '11.00 p.m':
        result = 23;
        break;
    }
  }
  return result;
}

function bookNow() {
  userInfo.searchInfo.resid = userInfo.updateRes.rid;
  var time = timeConvert(userInfo.searchInfo.time);
  userInfo.searchInfo.time_int = time;
  userInfo.searchInfo.uid = userInfo.user_UID;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (userInfo.user_auth_level == 0) {
        window.location.reload();
      } else {
        window.location.assign('/users/profile.html');
      }
    }
  };

  xhttp.open("POST", "/book.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userInfo.searchInfo));
}

function listBooking() {
  userInfo.bookObj = [];

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var userObj = JSON.parse(this.responseText);
      var i;
      for (i = 0; i < userObj.length; i++) {
        let current_datetime = new Date(userObj[i].date);
        let day = current_datetime.getDate();
        day = (day < 10) ? "0" + day : day;
        let month = current_datetime.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;
        let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + day;
        userInfo.bookObj.push({
          res_RID: userObj[i].RID,
          res_name: userObj[i].res_name,
          res_address: userObj[i].res_address,
          res_contact: userObj[i].res_contact,
          res_image: userObj[i].image,
          date: formatted_date,
          time: timeConvert(userObj[i].time),
          pax: userObj[i].pax,
          nref: userObj[i].REF
        });
      }
    }
  };

  xhttp.open("GET", "/users/booking?uid=" + userInfo.user_UID, true);

  xhttp.send();
}

function manageBooking(ref, name, seats, date, time) {
  userInfo.updateRes.name = name;
  userInfo.updateRes.seats = seats;
  userInfo.updateRes.date = date;
  userInfo.updateRes.time = time;
  userInfo.updateRes.ref = ref;
  userInfo.tab = 8;
}

function updateBooking() {
  userInfo.updateRes.time = timeConvert(userInfo.updateRes.time);

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload();
    }
  };

  xhttp.open("POST", "/users/booking/modify.json", true);

  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send(JSON.stringify(userInfo.updateRes));
}

function setup() {
  setDefaultDate();
  loadUserPage();
  profileEvent();
}

function profileEvent() {
  document.getElementById('upload-button').addEventListener('click', openDialog);

  function openDialog() {
    document.getElementById('field').click();
  }

  document.getElementById('field').addEventListener('change', submitForm);

  function submitForm() {
    document.getElementById('profile-form').submit();
  }
}
