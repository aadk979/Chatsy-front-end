
let yx;

function mentry(co , id) {
  localStorage.setItem('tc' , co);
  const element = document.getElementById(id);
  const rect = element.getBoundingClientRect();

  const topPercent = ((((rect.top / window.innerHeight) * 100) + 7 ).toString() + '%');
  const leftPercent = ((((rect.left / window.innerWidth) * 100) ).toString() + '%');
  openy(topPercent, leftPercent);
  yx = 0;
  const thisy = setInterval(() => {
    yx++;
    if (yx >= 3) {
      closey();
      clearInterval(thisy);
    }
  }, 1000);
}

function mentryg(co , id) {
  localStorage.setItem('tc' , co);
  const element = document.getElementById(id);
  const rect = element.getBoundingClientRect();

  const topPercent = ((((rect.top / window.innerHeight) * 100) + 7 ).toString() + '%');
  const leftPercent = ((((rect.left / window.innerWidth) * 100) ).toString() + '%');
  openyg(topPercent, leftPercent);
  yx = 0;
  const thisy = setInterval(() => {
    yx++;
    if (yx >= 3) {
      closeyg();
      clearInterval(thisy);
    }
  }, 1000);
}

function closey() {
  const mx = document.getElementById('menur');
  mx.style.opacity = '0';
  mx.style.transform = 'scaleY(0)';
  mx.style.pointerEvents = 'none';
}

function openy(t,l){
  const mx = document.getElementById('menur');
  if (localStorage.getItem("men") === "t" || localStorage.getItem("men") === null) {
    mx.style.opacity = '1';
    mx.style.transform = 'scaleY(1)';
    mx.style.pointerEvents = 'auto';
    mx.style.left = l;
    mx.style.top = t;
  }if (localStorage.getItem("men") === "f"){
    mx.style.opacity = '1';
    mx.style.transform = 'scaleY(1)';
    mx.style.pointerEvents = 'auto';
    mx.style.left = l;
    mx.style.top = t;
  }
}

function closeyg() {
  const mx = document.getElementById('groupmenu');
  mx.style.opacity = '0';
  mx.style.transform = 'scaleY(0)';
  mx.style.pointerEvents = 'none';
}

function openyg(t,l){
  const mx = document.getElementById('groupmenu');
  if (localStorage.getItem("men") === "t" || localStorage.getItem("men") === null) {
    mx.style.opacity = '1';
    mx.style.transform = 'scaleY(1)';
    mx.style.pointerEvents = 'auto';
    mx.style.left = l;
    mx.style.top = t;
  }if (localStorage.getItem("men") === "f"){
    mx.style.opacity = '1';
    mx.style.transform = 'scaleY(1)';
    mx.style.pointerEvents = 'auto';
    mx.style.left = l;
    mx.style.top = t;
  }
}

function report(){
  const name = sessionStorage.getItem("current");
  const reason = prompt("The message you tapped on will be logged as your reason for reporting this user. Please provide anything else you think is relevant to this report.");

  // Check if the user clicked OK, and if they typed something
  if (reason !== null) {
    // Check if the user provided some input
    if (reason.trim() !== "") {
      const myi = sessionStorage.getItem("myuic");
      const m = localStorage.getItem('tc');
      const ri = sessionStorage.getItem(name+'id');
      const socket = io("https://main-testing-server.onrender.com");

      // Emit the report
      socket.emit("report", { reported_id: ri, reason: { reason: reason, message: m }, reporter: myi });
      alert("Report sent");
    } else {
      // Alert the user that they need to provide a reason
      alert("You must provide a reason for reporting.");
    }
  } else {
    // Do nothing if the user clicked Cancel
  }
}

function block(){
  const name = sessionStorage.getItem("current");
  const res = prompt("Blocking a user cannot be undone. Are you sure you want to block this user (y/n)").toLowerCase();
  if (res === "y" || res === "yes"){
    sessionStorage.setItem(name+"blocked", "true");
  }
  document.getElementById('status').innerHTML = "Blocked";
  document.getElementById('status').style.color = "purple";
}

function notification(text , type){
  if(type === 'error'){
    document.getElementById('pop').textContent = text;
    document.getElementById("notification").style.color = '#721c24';
    document.getElementById("cbb").style.color = '#721c24';
    document.getElementById("notification").style.backgroundColor = '#f8d7da';
    document.getElementById("notification").style.display = "flex";
    setTimeout(()=>{
      document.getElementById("notification").style.display = "none";
    }, 7000);
  }else if(type === "notification"){
    document.getElementById('pop').textContent = text;
    document.getElementById("notification").style.display ="flex";
    setTimeout(()=>{
      document.getElementById("notification").style.display = "none";
    }, 7000);
  }
}

function copyToClipboard(userInput , x) {
  // Create a textarea element to temporarily hold the text
  var textArea = document.createElement("textarea");
  textArea.value = userInput;

  // Append the textarea to the document
  document.body.appendChild(textArea);

  // Select the text in the textarea
  textArea.select();

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the textarea from the document
  document.body.removeChild(textArea);
  if(x === 'f'){
    notification('Message copied!' , 'notification');
  }else{
    notification('UID copied!' , 'notification');
  }
}



function uid(){
  const name = sessionStorage.getItem("current");
  const data = sessionStorage.getItem(name+'id');
  copyToClipboard(data);
}

function cmx(){
  const data = localStorage.getItem('tc');
  copyToClipboard(data , 'f');
}