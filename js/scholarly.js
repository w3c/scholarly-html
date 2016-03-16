
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
  // copy some toc code from somewhere
  // generate numbering, too
}

// XXX
function deref () {
  // we have a builtin list (for now)
}

// XXX
function defigure () {
  // use the typeof to inject schema:name (with counter)
  // maybe load up PrismJS too?
}

// Handle <a>foo:concept</a> where 'foo' is a known ontology that we support.
// Creates a link and adds the style.
let ontomap = {
  schema: 'http://schema.org/',
  sa:     '#',
};
function deontology () {
  Array.from(document.querySelectorAll('a:not([href])'))
    .forEach($a => {
      let parts = $a.textContent.split(':');
      if (parts.length !== 2) return;
      let base = ontomap[parts[0]];
      if (!base) return;
      $a.setAttribute('href', `${base}${parts[1]}`);
      $a.setAttribute('class', 'onto');
    })
  ;
}

function despec () {
  detoc();
  deref();
  defigure();
  deontology();
}
if (document.readyState === 'complete') despec();
else document.addEventListener('DOMContentLoaded', despec, false);
