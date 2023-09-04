const { invoke } = window.__TAURI__.tauri;

const { St } = window.localStorage;

const { listen } = window.__TAURI__.tauri.invoke;

// console.log(window.event)


const unlisten = await window.__TAURI__.event.listen('log', (event) => {
  // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
  // event.payload is the payload object

  add_log(event.payload.level, event.payload.message)
})

var token = window.localStorage.getItem("token");
var inst = window.localStorage.getItem("instance");
var theme = window.localStorage.getItem("theme");


if (token == null) {
  window.localStorage.setItem("token", "");
  token = "";
}

if (inst == null) {
  window.localStorage.setItem("instance", "");
  inst = ""
}

if (theme == null) {
  window.localStorage.setItem("theme", "system");
  theme = "system"
}

let theme_radio = document.getElementsByClassName("theme_btn");


if (theme == "system") {
  theme_radio[2].click();
}
if (theme == "dark") {
  theme_radio[0].click();
}
if (theme == "light") {
  theme_radio[1].click();
}

function appendStringAsNodes(element, html) {
  var frag = document.createDocumentFragment(),
    tmp = document.createElement('body'), child;
  tmp.innerHTML = html;
  // Append elements in a loop to a DocumentFragment, so that the browser does
  // not re-render the document for each node
  while (child = tmp.firstChild) {
    frag.appendChild(child);
  }
  element.appendChild(frag); // Now, append all elements at once
  frag = tmp = null;
}

function add_log(level, text) {
  let el = document.getElementById("log-box");


  if (level == "TRACE") {


    if (text.length > 70) {
      appendStringAsNodes(el, `<span class="log-trace log">TRACE</span><details style='display: inline; margin-left: 10px'> <summary>${text.slice(0, 20)}...</summary> <span> ${text} <br> </span></details> <br>`)
    } else {
      appendStringAsNodes(el, `<span class="log-trace log">TRACE</span><span> ${text} <br> </span>`)
    }


  }
  if (level == "INFO") {

    appendStringAsNodes(el, `<span class="log-info log">INFO</span><span> ${text} <br> </span>`)
  }
  if (level == "WARN") {

    appendStringAsNodes(el, `<span class="log-warn log">WARN</span><span> ${text} <br> </span>`)
  }
  if (level == "ERROR") {

    appendStringAsNodes(el, `<span class="log-err log">ERROR</span><span> ${text} <br> </span>`)
  }
}



async function echo(val) {
  await invoke("echo", { val: val })
}

async function run() {
  let logs = await invoke("process", { token: token, instance: inst });

  console.log(logs);
}



let main_button = document.getElementById("main_button");


function disable_button() {
  main_button.textContent = "Processing..."

  main_button.setAttribute("disabled", "disabled")

  main_button.style.boxShadow = "0 0 0 rgb(0, 0, 0)";

  let load = document.getElementById("loading-infinity");
  load.style.visibility = "visible"

}

function enable_button() {
  main_button.textContent = "Start"

  main_button.removeAttribute("disabled")

  main_button.style.boxShadow = "0 0 20px rgb(64, 31, 147)";

  let load = document.getElementById("loading-infinity");
  load.style.visibility = "hidden"
}

function show_alert(id) {
  let el = document.getElementById(id);
  el.style.display = "flex";
}

function hide_alert(id) {
  let el = document.getElementById(id);
  el.style.display = "none";
}



main_button.addEventListener("click", async (e) => {


  disable_button();

  appendStringAsNodes(document.getElementById("log-box"), `<div class="divider">Start</div>`);

  await run();



  setTimeout(function () {
    // function code goes here
    enable_button();
    //hide_alert("err");

  }, 500);



});

let tk = document.getElementById("tk");
let inst_el = document.getElementById("inst");



inst_el.value = inst;
tk.value = token;

if (tk.value == '') {
  show_alert("warn");
}

tk.addEventListener("input", () => {


  console.log(tk.value);
  if (tk.value == '') {
    show_alert("warn");
  } else {
    hide_alert("warn")
    window.localStorage.setItem("token", tk.value);
  }
});



inst_el.addEventListener("input", () => {
  window.localStorage.setItem("instance", inst_el.value);
});


console.log("hiheihfasdf")



//


if (token != '') {
  input.value = token;

}

await invoke("echo", { val: token });

await invoke("echo", { val: "hi" });





window.addEventListener("DOMContentLoaded", () => {

  // let greetInputEl = document.querySelector("#greet-input");
  // greetMsgEl = document.querySelector("#greet-msg");
  // let document.querySelector("#greet-form").addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   greet();
  // });



});
