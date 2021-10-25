var URLinput = document.querySelector(".URL-input");
var titleInput = document.querySelector(".title-input");
//module.exports = titleInput;
var convertBtn = document.querySelector(".convert-button");
/*
document.getElementById("text-button").onclick = function () {
    document.getElementById("text").innerHTML = "クリックされた！";
};
*/
function clickEvent() {
  document.myform.submit();
}
convertBtn.addEventListener("click", () => {
  console.log(`URL: ${URLinput.value}`);
});
convertBtn.addEventListener("click", () => {
  console.log(`title: ${titleInput.value}`);
});
