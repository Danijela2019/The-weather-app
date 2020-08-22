function getWeather() {
  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    window.location = `http://localHost:3000/nearby?lat=${lat}&lon=${lon}`;
  }
  function error() {
    alert('Error, location is not provided');
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

getWeather();
