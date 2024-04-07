const checkbox = document.getElementById("termsCheckbox");
checkbox.addEventListener("change", function() {
  const isChecked = checkbox.checked;
  sessionStorage.setItem("cb", isChecked);
});
function setZIndex(value) {
  document.getElementById('container').style.zIndex = 5000;
}
const x = document.getElementById("container");
x.onmouseover = ()=>{
  x.style.zIndex = 5000;
};
x.onmouseout = ()=>{
  x.style.xIndex = 0;
};
x.style.zIndex = 5900;