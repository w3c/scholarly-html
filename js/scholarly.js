
let curID = 0;
function makeID (el) {
  if (!el.id) {
    curID++;
    el.id = `id${curID}`;
  }
  return el.id;
}

// XXX
function detoc () {

}

// XXX
function deref () {

}

function despec () {
  detoc();
  deref();
}
if (document.readyState === 'complete') despec();
else document.addEventListener('DOMContentLoaded', despec, false);
