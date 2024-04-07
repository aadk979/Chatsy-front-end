const auth = firebase.auth();
const socket = io('https://main-testing-server.onrender.com');
auth.onAuthStateChanged(user => {
  if (user) {
    const t = document.getElementById('t');
    localStorage.setItem('dn' , user.displayName);
    t.innerHTML = `Hey there ${user.displayName} , these are your settings.`;
  }else{
    window.location.replace('https://chatsy2.web.app');
    window.history.replaceState(null, null, window.location.href);
  }
});
const user = localStorage.getItem('myuic');
const token = localStorage.getItem('token_off');
const p = document.getElementById('changePassword');
const x = document.getElementById('displayName');
const pp = document.getElementById('pp');
const ppp = document.getElementById('ppp');
const set = document.getElementById('set');
function gen() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueCode = '';
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueCode += characters.charAt(randomIndex);
  }
  return uniqueCode;
}

ppp.onclick = ()=>{
  const code = gen();
  socket.emit('changeDisplayName', ({user:user, new:x.value.toString(), c: code , token:token}));
  x.value = '';
  socket.on(code, (d)=>{alert(d);});
};