var myMap;

function initMap(){

   
    var options = {
        zoom: 5,
        center:{lat: 25.290756, lng:-89.922655}
    }

      myMap = new google.maps.Map(document.getElementById('mapDiv'),options);



} 


  