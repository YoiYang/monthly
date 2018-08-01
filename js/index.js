


var url = new URL(document.URL);
let email = url.searchParams.get("email");
document.getElementById('username').value = email;

// var defaultStorage = firebase.storage()
document.getElementById('offline').addEventListener('click',function(){
    window.location.href='/yearly.html';
});
function log_in(){
    let email = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // alert(errorCode);
      alert(errorMessage);
    });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          console.log(user.emailVerified);
          if (user != null && user.emailVerified) {
              localStorage.offline = false;
              window.location.href = "/yearly.html";
          }
      }
    });


};
