
import sa from '@scienceai/scholarly-article';
import refs from './refs';

let curID = 0;
function makeID (el) {
  if (!el.id) {
    curID++;
    el.id = `id${curID}`;
  }
  return el.id;
}

function detoc () {
  Array.from(document.querySelectorAll('section'))
    .forEach($sec => {
      let level = depth($sec)
        , $h = $sec.firstElementChild
        , name = `h${(level > 6) ? 6 : level}`
      ;
      if ($h.localName !== name) {
        let $newH = document.createElement(name);
        while ($h.hasChildNodes()) $newH.appendChild($h.firstChild);
        for (let i = 0; i < $h.attributes.length; i++) {
          $newH.setAttribute($h.attributes[i].name, $h.attributes[i].value);
        }
        $sec.replaceChild($newH, $h);
        $h = $newH;
      }
      if (level > 6) $h.setAttribute('aria-level', level);
    })
  ;
  let $ol = makeTOCAtLevel(document.body, [0])
    , $ci = document.querySelector('div[role="contentinfo"]')
  ;
  $ci.insertBefore($ol, $ci.firstChild);
}
function depth ($sec) {
  let len = 2
    , $cur = $sec.parentNode
  ;
  while ($cur) {
    if ($cur.localName === 'section') len++;
    $cur = $cur.parentNode;
  }
  return len;
}
function children ($parent, name) {
  let res = []
    , $cur = $parent.firstElementChild
  ;
  while ($cur) {
    if ($cur.localName === name) res.push($cur);
    $cur = $cur.nextElementSibling;
  }
  return res;
}
function makeTOCAtLevel ($parent, current) {
  let $secs = children($parent, 'section');
  if ($secs.length === 0) return null;
  let $ol = document.createElement('ol');
  $ol.setAttribute('role', 'directory');
  $secs.forEach($sec => {
    let $h = $sec.firstElementChild;
    if (!$h || !/^h[2-6]$/.test($h.localName)) return;
    let id = $sec.id;
    if (!id) return;
    current[current.length - 1]++;
    let secnos = current.slice()
      , secno = secnos.join('.')
      , isTopLevel = secnos.length === 1
      ;
    if (isTopLevel) secno = `${secno}.`;
    let $span = document.createElement('span');
    $span.textContent = `${secno} `;
    $h.insertBefore($span, $h.firstChild);
    let $a = document.createElement('a');
    $a.href = `#${id}`;
    let $cur = $span;
    while ($cur) {
      $a.appendChild($cur.cloneNode(true));
      $cur = $cur.nextSibling;
    }
    let $li = document.createElement('li');
    $li.appendChild($a);
    $ol.appendChild($li);
    current.push(0);
    var $sub = makeTOCAtLevel($sec, current);
    if ($sub) $li.appendChild($sub);
    current.pop();
  });
  return $ol;
}

function deref () {
  let $dl = document.createElement('dl')
    , seen = {}
  ;
  // we have a builtin list (for now)
  Array.from(document.querySelectorAll('a[role="doc-biblioref"]'))
    .forEach($ref => {
      let key = $ref.textContent;
      if (!refs[key]) return console.error(`No ref: ${key}`);
      $ref.href = `#ref-${key}`;
      if (seen[key]) return;
      seen[key] = true;
      let $dt = document.createElement('dt');
      $dt.id = `ref-${key}`;
      $dt.textContent = key;
      $dl.appendChild($dt);
      let $div = document.createElement('div');
      $div.innerHTML = refs[key];
      $dl.appendChild($div.firstElementChild);
    })
  ;
  let $section = document.createElement('section')
    , $h2 = document.createElement('h2')
  ;
  $section.id = 'biblio-references';
  $h2.textContent = 'References';
  $section.appendChild($h2);
  $section.appendChild($dl);
  document.body.appendChild($section);
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
  sa:     'http://ns.science.ai/#',
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
  deref();
  detoc();
  defigure();
  deontology();
}
if (document.readyState === 'complete') despec();
else document.addEventListener('DOMContentLoaded', despec, false);
