const ff = document.getElementById('burger-icon');
let y;

ff.addEventListener("click" , ()=>{
  mentr();
});

function mentr() {
  open();
  y = 0;
  const thisy = setInterval(() => {
    y++;
    if (y >= 3) {
      close();
      clearInterval(thisy);
    }
  }, 1000);
}

function close() {
  const m = document.getElementById('menu');
    m.style.opacity = '0';
    m.style.transform = 'scaleY(0)';
    m.style.pointerEvents = 'none';
}

function open(){
   const m = document.getElementById('menu');
  if (sessionStorage.getItem("men") === "t" || sessionStorage.getItem("men") === null) {
    m.style.opacity = '1';
    m.style.transform = 'scaleY(1)';
    m.style.pointerEvents = 'auto';
    m.style.offsetLeft = "70%";
  }if (sessionStorage.getItem("men") === "f"){
    m.style.opacity = '1';
    m.style.transform = 'scaleY(1)';
    m.style.pointerEvents = 'auto';
    m.style.offsetLeft = "20%";
  }
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.replace('https://chatsy2.web.app/');
    window.history.replaceState(null, null, window.location.href);
  });
}

function esc(){
  const l = localStorage.getItem('escl');
  if (l === null){
      window.location.replace('https://google.com');
      window.history.replaceState(null, null, window.location.href);
  }else if (l !== null){
      window.location.replace(l);
      window.history.replaceState(null, null, window.location.href);
  }
}

function showPrivacyPolicy() {
  window.location.href = "privacy.html";
}

function menutry(){
  const r = sessionStorage.getItem("men");
  if (r === "t" || r === null){
    offit();
  }else if (r === "f"){
    onit();
  }
  close();
}

function onit() {
    var sDiv = document.getElementById('ss');
    sDiv.style.display = 'flex';
    sDiv.style.flex = "3";
    sessionStorage.setItem("men" , "t");
}

function offit(){
  var sDiv = document.getElementById('ss');
  sDiv.style.display = 'none';
  sessionStorage.setItem("men" , "f");
}

let startX;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const swipeDistance = endX - startX;

    // You can adjust the threshold as needed
    if (swipeDistance > 90) {
        onit();
    }
});

let startXLeftSwipe;

document.addEventListener('touchstart', (e) => {
    startXLeftSwipe = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    const endXLeftSwipe = e.changedTouches[0].clientX;
    const swipeDistanceLeftSwipe = startXLeftSwipe - endXLeftSwipe;

    if (swipeDistanceLeftSwipe > 90) {
        offit();
    }
});

function opennew() {
    window.open('https://chatsy2.web.app/settings.html', '_blank');
}