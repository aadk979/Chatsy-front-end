// Running version 1.0.0 //
sessionStorage.clear();
console.log("Welcome to Chatsy! 🚀");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { authenticateUser } from './passkey_chatsy_secure.js'
const socket = io("https://main-testing-server.onrender.com");
let  currentChat = null;
let  chatHistory = {};
let  username ;
let  cu = new Set();
let  uniqueCode;
let  storage = {};
let  group = {};
let  token;
let  masterKey;
let  currentcc;
let  groupss = new Set();
let  locked = new Set();
let  mygroups = new Set();

setTimeout(()=>{loadChatHistory()}, 3000);

const thing = localStorage.getItem('grouptemphis');
if(thing){
  group = JSON.parse(thing);
}

function addToChatHistory(user, message, timestamp, sent) {
  if (!chatHistory[user]) {
    chatHistory[user] = [];
  }
  encrypt(message , masterKey).then((stuff)=>{
    chatHistory[user].push({
      text: stuff,
      timestamp: timestamp,
      sent: sent,
      uid: user
    });
    saveChatHistory();
  })
}

const isa = document.getElementById('is');

isa.onclick = ()=>{
  var myDiv = document.getElementById('chatMessages');
  var lastDiv = myDiv.lastElementChild;
  lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

setTimeout(()=>{f();},1000);

function checkInternetConnection() {
  if (navigator.onLine) {
  } else {
    alert('No internet connection. Please check your network settings and try again.');
  }
}

setInterval(checkInternetConnection, 1000);
sessionStorage.setItem('men' , 'f');
socket.on("report" , (data)=>{
  if(data.name === uniqueCode){
    notification("Someone reported you! You might be banned soon 😭." , 'error')
  }
});

function checkProtocol() {
    var currentURL = window.location.href;
    if (currentURL.startsWith('http://')) {
        kill();
    }
}

checkProtocol();

setTimeout(()=>{sessionStorage.setItem("myname" , username);},1000);

function grc() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';

  for (let i = 0; i < 30; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

export { grc };

function validate(c){
  const ff = localStorage.getItem("validation_state");
  if (ff === 'await'){
    let cody = grc();
    setTimeout(()=>{
      socket.emit("val", ({val: c, id: cody, uic: uniqueCode}));
      socket.on(cody,(data)=>{
        if(data !== "valid"){
          kill();
        }else{
          localStorage.setItem("validation_state" , 'valid');
        }
      });
    },1000);
  }else if(ff === 'valid'){
    return;
  }else{
    kill();
  }
}

function kill() {
  alert("Invalid user, redirecting to sign-in page");
  localStorage.clear();
  sessionStorage.clear();
  firebase.auth().signOut().then(() => {
   window.location.replace('https://chatsy2.web.app');
   window.history.replaceState(null, null, window.location.href);
  });
}

document.getElementById('messageInput').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    if(currentcc === 'chat'){
      sendMessage(true);
    }else if (currentcc === 'group'){
      sendMessage(false);
    }else{
      sendMessage(true);
    }
  }
});

document.getElementById('us').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    const v = document.getElementById("us").value;
    if (cu.has(v)){
      const n = sessionStorage.getItem(v);
      openChat(n);
    }else{
      alert("No such user detected")
    }
  }
});

document.getElementById("sendButton").addEventListener("click" , ()=>{
  if(currentcc === 'chat'){
    sendMessage(true);
  }else if (currentcc === 'group'){
    sendMessage(false);
  }else{
    sendMessage(true);
  }
});

socket.on("disconnect", ()=>{
  notification('You have been disconnected from the server. Please try reloading the page.', 'error' , 'stay')
});

const url = window.location.href;
const newu = url.toString();

let startIndex = newu.indexOf("?user=");
let endIndex = newu.indexOf("?uic=");
let endyindex = newu.indexOf("?valc=");
let userInfo = newu.substring(startIndex + 6, endIndex);
let extractedString = newu.substring(endIndex + 5, endyindex);
let valcode = newu.substring(newu.length - 30);


validate(valcode);
setInterval(()=>{validate(null)},1000);

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  alert('Unable to establish a connection with the server. Please check your network connection and try again later.');
});

username = userInfo;

setTimeout(()=>{
  sessionStorage.setItem("myuic" , extractedString);
},5000);

if (!url.includes('uic=')) {
  kill();
}

uniqueCode = extractedString;

function f(){
  const code = grc();
  socket.emit('token' , ({uic:uniqueCode , code:code}));
  socket.on(code , (data)=>{
    token = data.token;
    localStorage.setItem("token_off" , token);
  });
}

socket.on("connect" , ()=>{
  setInterval(()=>{
    socket.emit("id" , {user: username,uic: uniqueCode});
  },100)
});

socket.on("id", (data) =>{
  if(data.user !== username && sessionStorage.getItem(data.uic) === null){
    sessionStorage.setItem(data.uic, data.user);
    sessionStorage.setItem((data.user + 'id'), data.uic);
  }
});

socket.on("disc", (data) => {
  const nrn = sessionStorage.getItem(data.uic);

  sessionStorage.setItem(nrn+'id', "disc");

  setTimeout(() => {

    removeUser(nrn ,data.uic);

    sessionStorage.removeItem(data.uic);
    sessionStorage.removeItem((nrn + 'id'));
    delete storage[data.uic];
    cu.delete(data.uic);
  }, 1000);
});

function removeUser(usernameToRemove, id) {
  const userList = document.getElementById('userList');
  const userElements = userList.getElementsByClassName('user');

  for (let i = 0; i < userElements.length; i++) {
    if (userElements[i].textContent === usernameToRemove) {
      userElements[i].remove();
      break; 
    }
  }

}

const locky = document.getElementById('chatlock');
const unlocky = document.getElementById('chatunlock');

locky.onclick = ()=>{
  const return_1 = grc();
  socket.emit('web-auth-status' , ({uid: uniqueCode , return: return_1}));
  socket.on(return_1 , (data)=>{
    if(data === 'set'){
      const track = sessionStorage.getItem(currentChat+'id');
      locked.add(track);
      notification('Chat locked! (May take up to 5 seconds to authenticate and open chat)' , 'notification');
    }else{
      notification('Passkey not setup , please visit settings page to setup Passkey.', 'error')
    }
  });
}

unlocky.onclick = ()=>{
  const track = sessionStorage.getItem(currentChat+'id');
  locked.delete(track);
  notification('Chat unlocked!' , 'notification');
}

async function encrypt(data , key1) {
    try{
      const plaintext = data;
      const key = key1;
      const encryptedText = await CryptoJS.AES.encrypt(plaintext, key).toString();
      return encryptedText;
    }catch(e){
      notification(e,'error');
    }
}

async function decrypt(data , key1) {
    try{
      const key = key1;
      const encryptedText = data;
      const decryptedText = await CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
      return decryptedText;
    }catch(e){
      notification(e,'error');
    }
}

function generateKeyForClientToClient() {
    const keyLength = 256 / 4;
    let key = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < keyLength; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

function notification(text , type , con){
  if(type === 'error'){
    document.getElementById('pop').textContent = text;
    document.getElementById("notification").style.color = '#721c24';
    document.getElementById("cbb").style.color = '#721c24';
    document.getElementById("notification").style.backgroundColor = '#f8d7da';
    document.getElementById("notification").style.display = "flex";
    if(con === null){
      setTimeout(()=>{
        document.getElementById("notification").style.display = "none";
      }, 7000);
    }
  }else if(type === "notification"){
    document.getElementById('pop').textContent = text;
    document.getElementById("notification").style.color = '#155724';
    document.getElementById("cbb").style.color = '#155724';
    document.getElementById("notification").style.backgroundColor = '#d4edda';
    document.getElementById("notification").style.display ="flex";
    if(con === null){
      setTimeout(()=>{
        document.getElementById("notification").style.display = "none";
      }, 7000);
    }
  }
}

setInterval(()=>{
  socket.emit("newuser",  ({uid:uniqueCode , name: username}));
},100);


socket.on("newuser" , (data)=>{
  if(data.uid !== uniqueCode){
    if (!cu.has(data.uid)){
      const key = generateKeyForClientToClient();
      socket.emit("key", ({to:data.uid ,  from:uniqueCode , key:key}));
      storage[data.uid] = key;
      cu.add(data.uid);
      addUser(data.name);
      }
    }
});

const cgs = document.getElementById('cgc');
const jgs = document.getElementById('jgc');

cgs.onclick = ()=>{
  document.getElementById('title').textContent = 'Create Group';
  document.getElementById('input-bar-input').placeholder = 'Group name...';
  document.getElementById('hover-menu');
  document.getElementById('hover-menu').style.display = 'flex';
  const newb = document.getElementById('input-bar-button');
  newb.onclick = ()=>{
    creategroup(document.getElementById('input-bar-input').value);
    document.getElementById('input-bar-input').value = '';
  }
};

jgs.onclick = ()=>{
  document.getElementById('title').textContent = 'Join Group';
  document.getElementById('input-bar-input').placeholder = 'Group code...';
  document.getElementById('hover-menu');
  document.getElementById('hover-menu').style.display = 'flex';
  const newb = document.getElementById('input-bar-button');
  newb.onclick = ()=>{
    joingroup(document.getElementById('input-bar-input').value);
    document.getElementById('input-bar-input').value = '';
  }
};

function creategroup(gg) {
  if (gg === null) {
    document.getElementById('hover-menu').style.display = 'none';
    return;
  }

  if(gg === ''){
    document.getElementById('hover-menu').style.display = 'none';
    alert('Group name cannot be empty');
    return;
  }

  if(mygroups.has(gg)){
    document.getElementById('hover-menu').style.display = 'none';
    alert('Group already exists');
    return;
  }

  const g = DOMPurify.sanitize(gg);
  const code = grc();
  socket.emit('newgroup', { uic: uniqueCode, name: g, code: code });
  socket.on(code, (data) => {
    if (data !== 'error') {
      groupss.add(data.code);
      mygroups.add(gg);
      alert(`Group ${g} has been created successfully! 🎉\n\nGroups may experience minor issues temporarily, but rest assured they will be fully functional soon. Share the group code with others to join.\n\nPlease note: Groups are valid for this session only and will be deleted once all users have logged out.\n\nGroup Code: ${data.code}`);
      addUser(g, true);
      sessionStorage.setItem(g + 'group' + g, JSON.stringify({ state: null, name: g, code: data.code, key: data.key, user_num: data.user_num }));
      document.getElementById('hover-menu').style.display = 'none';
      opengroup(gg);
    } else {
      document.getElementById('hover-menu').style.display = 'none';
      notification('Failed to create group.' , 'error');
    }
  });
}


function joingroup(x){
  const cc = x;
  const c = DOMPurify.sanitize(cc);
  const code = grc();
  socket.emit('joingroup' , ({uic:uniqueCode , code:code , secret:c }));
  socket.on(code , (data)=>{
    if(data === 'error'){
      document.getElementById('hover-menu').style.display = 'none';
      alert('Error joining group.');
    }else if(data === 'invalid'){
      document.getElementById('hover-menu').style.display = 'none';
      alert(('Invalid code.'));
    }else if (data.state === 'valid'){
      if(mygroups.has(data.name)){
        document.getElementById('hover-menu').style.display = 'none';
        alert('You are already in this group.');
        return;
      }
      groupss.add(c);
      addUser(data.name , true);
      sessionStorage.setItem(data.name + 'group'+data.name , JSON.stringify(data));
      document.getElementById('hover-menu').style.display = 'none';
      alert('Joined group succesfully! Groups may experience minor issues temporarily, but rest assured they will be fully functional soon.');
      opengroup(data.name);
    }else if(data === 'ex'){
      document.getElementById('hover-menu').style.display = 'none';
      alert('You are already in this group.');
    }
  });
}

socket.on((uniqueCode + 'key').toString() , (data)=>{
  if(data.to === uniqueCode){
    const key = data.key;
    sessionStorage.setItem((data.from + 'key'), key);
  }
});

socket.on(uniqueCode + 'auth-disabled',(data)=>{
  const token = localStorage.getItem('token_off');
  if(data.token === token){
    locked.clear();
  }
});

function addUser(x, y) {
  const userList = document.getElementById('userList');
  const newUserElement = document.createElement('div');
  const imgElement = document.createElement('img');

  if (y !== true) {
    newUserElement.onclick = function() {
      openChat(x);
    };
  } else {
    newUserElement.onclick = function() {
      opengroup(x);
    };
  }

  newUserElement.className = 'user';
  newUserElement.textContent = x;

  if(y !== true){
    imgElement.src = 'user.png';
  }else{
    imgElement.src = 'group.png';
  }
  
  imgElement.id = 'user--img';
  newUserElement.appendChild(imgElement);

  userList.appendChild(newUserElement);
}

function setBackgroundFromSessionStorage() {
    const backgroundImageData = localStorage.getItem('userImage');
    if (backgroundImageData) {
        const contentContainer = document.getElementById('chatMessages');
        contentContainer.style.backgroundImage = `url(${backgroundImageData})`;
        contentContainer.style.backgroundSize = 'cover';
        contentContainer.style.backgroundPosition = 'center';
        contentContainer.style.backgroundRepeat = 'no-repeat';
    } else {
        return;
    }
}

function handleSuccessfulAuthentication(user) {
    var container = document.getElementById('stat/ccu');
    function checkOverflow() {
        if (container.scrollWidth > container.clientWidth || !container.scrollWidth) {
            container.style.flexDirection = 'column';
        } else {
            container.style.flexDirection = 'row';
        }
    }

    setInterval(()=>{checkOverflow();},100);
    const track = sessionStorage.getItem(user+'id');
    currentcc = 'chat';
    if(locked.has(track)){
        document.getElementById('chatlock').style.display = 'none';
        document.getElementById('chatunlock').style.display = 'block';
    }else{
        document.getElementById('chatunlock').style.display = 'none';
        document.getElementById('chatlock').style.display = 'block';
    }
    const inputElement = document.getElementById('messageInput');
    inputElement.disabled = false;
    setBackgroundFromSessionStorage();

    sessionStorage.setItem("current" , user);
    setInterval(()=>{
      if(sessionStorage.getItem(user+"blocked") !== "true" && currentChat === user){
        document.getElementById('status').innerHTML = "(Online)";
        document.getElementById('status').style.color = "green";
        document.getElementById('status').style.fontWeight = "800";
      }
    } , 100);
    currentChat = user;
    document.getElementById("currentChatUser").innerHTML = user;
    setInterval(()=>{
       const state = sessionStorage.getItem(user+'id');
      if((state === "disc" || state === null) && sessionStorage.getItem(user+"blocked") !== "true" && currentChat === user){
        document.getElementById('status').innerHTML = "(Offline)";
        document.getElementById('status').style.color = "red";
        document.getElementById('status').style.fontWeight = "800";
        inputElement.disabled = true;
        sessionStorage.removeItem(user);
      }
    },100);
    const state2 = sessionStorage.getItem(user+'id');
    const chatMessages = chatHistory[state2] || [];
    const chatMessagesDiv = document.getElementById('chatMessages');
    chatMessagesDiv.innerHTML = '';

    chatMessages.forEach((message) => {
        if (message.sent) {
            decrypt(message.text, masterKey).then((stuff)=>{
                displaySentMessage(stuff, message.timestamp);
            })
        } else if(message.sent === false){
            decrypt(message.text, masterKey).then((stuff)=>{
                displayReceivedMessage(stuff, message.timestamp , true);
            });
        }
    });
}

function onit() {
    var sDiv = document.getElementById('ss');
    sDiv.style.display = 'flex';
    sDiv.style.flex = "3";
    sessionStorage.setItem("men" , "t");
}
onit();

function offit(){
  var sDiv = document.getElementById('ss');
  sDiv.style.display = 'none';
  sessionStorage.setItem("men" , "f");
}

sessionStorage.setItem("close-status" , false);

function openChat(user) {
  const close = sessionStorage.getItem("close-status");
  if(close === 'true'){
    offit();
  }
  const track = sessionStorage.getItem(user + 'id');
  if (locked.has(track)) {
    const return_1 = grc();
    socket.emit('web-auth-auth', { uid: uniqueCode, return: return_1 });
    socket.on(return_1, async (data) => {
      const auth_data = {
        user_cred: data.cid,
        verification_code: data.ch
      }
      authenticateUser(auth_data)
      .then((res)=>{
        if(res === 200){
          handleSuccessfulAuthentication(user);
        }else if(res === 400){
          notification('Authentication failed!', 'error');
        }
      })
      .catch((e)=>{
        notification(e.message , 'error');
        console.error(e.message);
        return ;
      });
    });
  }else{
      var container = document.getElementById('stat/ccu');
      function checkOverflow() {
          if (container.scrollWidth > container.clientWidth || !container.scrollWidth) {
              container.style.flexDirection = 'column';
          } else {
              container.style.flexDirection = 'row';
          }
      }

      setInterval(()=>{checkOverflow();},100);
      if(locked.has(track)){
        document.getElementById('chatlock').style.display = 'none';
        document.getElementById('chatunlock').style.display = 'block';
      }else{
        document.getElementById('chatunlock').style.display = 'none';
        document.getElementById('chatlock').style.display = 'block';
      }
      currentcc = 'chat'; 
      const inputElement = document.getElementById('messageInput');
      inputElement.disabled = false;
      setBackgroundFromSessionStorage();

      sessionStorage.setItem("current" , user);
      setInterval(()=>{
        if(sessionStorage.getItem(user+"blocked") !== "true" && currentChat === user){
          document.getElementById('status').innerHTML = "(Online)";
          document.getElementById('status').style.color = "green";
          document.getElementById('status').style.fontWeight = "800";
        }
      } , 100);
      currentChat = user;
      document.getElementById("currentChatUser").innerHTML = user;
      setInterval(()=>{
         const state = sessionStorage.getItem(user+'id');
        if((state === "disc" || state === null) && sessionStorage.getItem(user+"blocked") !== "true" && currentChat === user){
          document.getElementById('status').innerHTML = "(Offline)";
          document.getElementById('status').style.color = "red";
          document.getElementById('status').style.fontWeight = "800";
          inputElement.disabled = true;
          sessionStorage.removeItem(user);
        }
      },100);
      const state2 = sessionStorage.getItem(user+'id');
      const chatMessages = chatHistory[state2] || [];
      const chatMessagesDiv = document.getElementById('chatMessages');
      chatMessagesDiv.innerHTML = '';
      chatMessagesDiv.innerHTML = '';

      chatMessages.forEach((message) => {
        if (message.sent) {
          decrypt(message.text, masterKey).then((stuff)=>{
            displaySentMessage(stuff, message.timestamp);
          })
        } else if(message.sent === false){
          decrypt(message.text, masterKey).then((stuff)=>{
            displayReceivedMessage(stuff, message.timestamp , true);
          });
        }
      });
    }

}

function opengroup(user) {
  const close = sessionStorage.getItem("close-status");
  if(close === 'true'){
    offit();
  }
  var container = document.getElementById('stat/ccu');

  function checkOverflow() {
      if (container.scrollWidth > container.clientWidth) {
          container.style.flexDirection = 'column';
      } else {
          container.style.flexDirection = 'row';
      }
  }
  setInterval(()=>{checkOverflow();},100);
  document.getElementById('status').innerHTML = "(Group)";
  document.getElementById('status').style.color = "#373cbb";
  document.getElementById('status').style.fontWeight = "800";
  const chatMessagesDiv = document.getElementById('chatMessages');
  chatMessagesDiv.innerHTML = '';
  chatMessagesDiv.innerHTML = '';
  setBackgroundFromSessionStorage();
  let r = JSON.parse(sessionStorage.getItem(user+'group'+user));
  const gcode = r.gcode;
  currentcc = 'group';
  currentChat = user+'group';
  document.getElementById("currentChatUser").innerHTML = (user);
  sessionStorage.setItem("current" , user);
  const chatMessages = document.getElementById('chatMessages');
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  const messageDiv = document.createElement('div');
  messageDiv.className = 'group_display';
  messageDiv.textContent = 'Group code: ' + (gcode  || r.code);
  messageContainer.appendChild(messageDiv);
  chatMessages.appendChild(messageContainer);
  const chatMessagesx = group[user+'group'+user] || [];
  chatMessagesx.forEach((message) => {
    if (message.sent) {
        displaySentMessage(message.text, message.timestamp);
    } else if(message.sent === false){
        displayReceivedMessage(message.text, message.timestamp , false);
    }
  });
}

function sendMessage(x) {
  if(x === true){
    let messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (!currentChat) {
      notification("No user selected." , 'error');
      return;
    }

    const ci = sessionStorage.getItem(currentChat + 'id');
    const key = sessionStorage.getItem(ci + 'key');

    if (!key || !ci) {
      notification('User is offline.' , 'error');
      return;
    }

    if (sessionStorage.getItem(currentChat + 'blocked') === "true") {
      notification("You have blocked this user." , 'error');
      return;
    }

    if (message.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      const messageWithTimestamp = `${message}`;

      const iddd = displaySentMessage(messageWithTimestamp, timestamp);

      encrypt(messageWithTimestamp, key)
        .then(encrypted => {
          socket.emit("message", { message: encrypted, time: timestamp, to: ci, from: uniqueCode, token: token });
          messageInput.value = '';
          var myDiv = document.getElementById('chatMessages');
          var lastDiv = myDiv.lastElementChild;

          lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
          addToChatHistory(ci, messageWithTimestamp, timestamp ,true);
        })
        .catch(error => {
          console.error(error);
          document.getElementById(iddd).style.background = "red";
          const ff = document.getElementById(iddd).textContent;
          document.getElementById(iddd).textContent = ff + ' ⚠️'
        });
    }
  }else if (x === false){
    let messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    const user = sessionStorage.getItem('current');
    let y = JSON.parse(sessionStorage.getItem(user+'group'+user));
    let x = y.key;
    if (message.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      const messageWithTimestamp = `You: ${message}`;
      const messageWithTimestampx = `${message}`;

      displaySentMessage(messageWithTimestamp, timestamp);
      const pp = user+'group'+user;
      if(!group[pp]){
        group[pp] = []
      }
      group[pp].push({text:messageWithTimestamp , sent:true , timestamp:timestamp});
      localStorage.setItem('grouptemphis' , JSON.stringify(group));
      encrypt(messageWithTimestampx, x)
        .then(encrypted => {
                const gcode = y.code; 
                socket.emit('groupmessage', ({m: encrypted ,gcode: gcode ,t: timestamp , to: user , from: uniqueCode, name: username}));
                messageInput.value = '';
                var myDiv = document.getElementById('chatMessages');
                var lastDiv = myDiv.lastElementChild;

                lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }
  }
}

document.getElementById('user-prof').onclick = ()=>{
  const track = sessionStorage.getItem(currentChat + 'id');
  const code = grc();
  socket.emit('profile-req' , ({uid: track , return:code}));
  socket.on(code , (data)=>{
    document.getElementById("user-name").textContent = currentChat;
    document.getElementById('user-id').textContent = track;
    document.getElementById('user-int').textContent = data.int;
    document.getElementById('user-bio').textContent = data.bio ;
    document.getElementById('user-email').textContent = data.email;
    document.getElementById("user-image").src = data.photo;
    document.getElementById('user-profile').style.display = 'flex';
  });
}

socket.on('group', (data)=>{
  if(data.from !== uniqueCode){
    const user = data.to;
    if(groupss.has(data.gcode)){
      let y = JSON.parse(sessionStorage.getItem(user+'group'+user));
      let x = y.key;
      opengroup(data.to);
      decrypt(data.m ,x ).then((d)=>{
        const pp = user+'group'+user;
        if(!group[pp]){
          group[pp] = []
        }
        group[pp].push({text:(data.name + ': '+d) , sent:false , timestamp:data.t});
        localStorage.setItem('grouptemphis' , JSON.stringify(group));
        displayReceivedMessage((data.name + ': '+d) , data.t);
        var myDiv = document.getElementById('chatMessages');
        var lastDiv = myDiv.lastElementChild;

        lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }
});

function displaySentMessage(message, timestamp) {
  const cody = grc();
  const chatMessages = document.getElementById('chatMessages');
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';

  const messageDiv = document.createElement('div');
  const xx = document.createElement('div');
  xx.id = 'xx';
  messageDiv.className = 'message-bubblei';
  messageDiv.id = cody;
  messageDiv.textContent = message;
  messageDiv.onClick = function(){
    run();
  };
  messageContainer.appendChild(messageDiv);
  messageContainer.appendChild(xx);

  if (timestamp) {
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestampi';

    const timeParts = timestamp.split(':');
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);

    let formattedTimestamp;

    if (minute > 10) {
      formattedTimestamp = `${hour}:${minute}`;
    } else {
      formattedTimestamp = `${hour}:0${minute}`;
    }

    timestampDiv.textContent = formattedTimestamp;
    messageContainer.appendChild(timestampDiv);
  }

  chatMessages.appendChild(messageContainer);
  return cody;
}


function displayReceivedMessage(message, timestamp , xppy) {
    const code = grc();
    const chatMessages = document.getElementById('chatMessages');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const messageDiv = document.createElement('div');
    const xx = document.createElement('div');
    xx.id = 'xx';
    messageDiv.className = 'message-bubble';
    messageDiv.id = code;
    messageDiv.textContent = message;
    if(xppy === true){
      messageDiv.onclick = function() {
        mentry(message , code);
      };
    }else{
      messageDiv.onclick = function() {
        mentryg(message , code);
      };
    }
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(xx);

    if (timestamp) {
      const timestampDiv = document.createElement('div');
      timestampDiv.className = 'timestamp';

      const timeParts = timestamp.split(':');
      const hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);

      let formattedTimestamp;

      if (minute > 10) {
        formattedTimestamp = `${hour}:${minute}`;
      } else {
        formattedTimestamp = `${hour}:0${minute}`;
      }

      timestampDiv.textContent = formattedTimestamp;
      messageContainer.appendChild(timestampDiv);
    }

    chatMessages.appendChild(messageContainer);
}

socket.on('req-rejected' + uniqueCode, (data)=>{
  alert(data);
});

socket.on((uniqueCode + 'logout').toString() , (data)=>{
  if(data === uniqueCode){
    localStorage.clear();
    sessionStorage.clear();
    firebase.auth().signOut()
  }
});

socket.on((uniqueCode + 'mess').toString() , (data) => {
  const name = sessionStorage.getItem(data.from);
  if(sessionStorage.getItem(name +"blocked") !== "true"){
    if (data.to === uniqueCode) {
      const key = storage[data.from];
      if(currentChat === name){
        decrypt(data.message, key)
        .then((decrypted) => {
          addToChatHistory(data.from, decrypted, data.time,false);
          displayReceivedMessage(decrypted, data.time , true);
          var myDiv = document.getElementById('chatMessages');
          var lastDiv = myDiv.lastElementChild;
          lastDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
      }else{
        notification(`You have a new message from ${name} .` , 'notification')
        decrypt(data.message, key)
          .then((decrypted) => {
            addToChatHistory(data.from, decrypted, data.time,false);
          });
      }
    }
  }
});

const auth = firebase.auth();
auth.onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    if(uid !== uniqueCode){
      kill();
    }else{
      const code = grc();
      socket.emit('session-key-create' , ({uid: uid , return: code}));
      socket.on(code , (data)=>{
        localStorage.setItem('session-key' , ({key: data.key}));
      });
    }
  }else{
    window.location.replace('https://chatsy2.web.app');
    window.history.replaceState(null, null, window.location.href);
  }
});

function saveChatHistory() {
  const code = grc();
    socket.emit('save-req' , ({code: code, uid:uniqueCode, his: {x:JSON.stringify(chatHistory)}}));;
    socket.on(code, (data)=>{
      if(data === 200){
        return;
      }else if(data === 300){
        return;
      }else{
        return;
      }
  })
}

function loadChatHistory() {
  const code = grc();
  socket.emit('retrival-key' , ({uid:uniqueCode, token: token , code: code}));;
  socket.on(code , data =>{
    masterKey = data;
  });
  const cody = grc();
  socket.emit('retrival' , ({uid:uniqueCode, token: token , code: cody}));;
  socket.on(cody , (data)=>{
    const savedChatHistory = data;
    if (savedChatHistory) {
      const x = savedChatHistory.x;
      chatHistory =(JSON.parse(x));
    }
  });
}

socket.on('notify' , (data)=>{
  notification(data.message , data.type);
});

// Function to open (or create) the indexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const dbName = "chatsydb";
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("users", { keyPath: "uid" });
      objectStore.createIndex("email", "email", { unique: false });
      objectStore.createIndex("uid", "uid", { unique: true });
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

// Function to add user data to indexedDB
function addUserdb(email, uid) {
  openDatabase().then(db => {
    const transaction = db.transaction(["users"], "readwrite");
    const objectStore = transaction.objectStore("users");
    const userData = { email: email, uid: uid };
    const addUserRequest = objectStore.add(userData);

    addUserRequest.onsuccess = function(event) {
      console.log("Data added to IndexedDB successfully");
    };

    addUserRequest.onerror = function(event) {
      console.error("Error adding data to IndexedDB:", event.target.error);
    };
  }).catch(error => {
    console.error("Error opening IndexedDB:", error);
  });
}

// Function to retrieve user data from indexedDB
function getUsersdb() {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(["users"], "readonly");
      const objectStore = transaction.objectStore("users");
      const getAllUsersRequest = objectStore.getAll();

      getAllUsersRequest.onsuccess = function(event) {
        resolve(event.target.result);
      };

      getAllUsersRequest.onerror = function(event) {
        reject(event.target.error);
      };
    }).catch(error => {
      console.error("Error opening IndexedDB:", error);
      reject(error);
    });
  });
}

function clearUsers() {
  openDatabase().then(db => {
    const transaction = db.transaction(["users"], "readwrite");
    const objectStore = transaction.objectStore("users");
    const clearUsersRequest = objectStore.clear();

    clearUsersRequest.onsuccess = function(event) {
      console.log("All users cleared from IndexedDB successfully");
    };

    clearUsersRequest.onerror = function(event) {
      console.error("Error clearing users from IndexedDB:", event.target.error);
    };
  }).catch(error => {
    console.error("Error opening IndexedDB:", error);
  });
}

clearUsers();

const x = JSON.parse(localStorage.getItem('user_data_firebase'));
addUserdb(x.email, x.uid);
