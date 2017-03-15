module.exports={
  'name': {
     notEmpty: true,
     errorMessage:"Name is Required",
   },
  'latitude': {
     notEmpty: true,
     errorMessage:"Latitude is Required",
   },
   'longitude': {
     notEmpty: true,
     errorMessage: 'Longitude is Required' // Error message for the parameter
   }
}
