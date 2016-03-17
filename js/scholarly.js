
import sa from '@scienceai/scholarly-article';

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
  let $ol = makeTOCAtLevel(document.body, [0]);
  document.querySelector('div[role="contentinfo"]').appendChild($ol);
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

// XXX
function deref () {
  // we have a builtin list (for now)
}

// XXX
function defigure () {
  // use the typeof to inject schema:name (with counter)
  // maybe load up PrismJS too?
}

// generate definitions from the vocabulary
let skipList = [
  'Checksum', 'PerceptualHash', 'contentChecksum', 'checksumAlgorithm', 'checksumValue',
  'progress', 'AccessControl', 'selector', 'WebVerse', 'webVerseKey', 'webVerseHash', 'webVerseId',
  'startOffset', 'endOffset', 'TargetRole', 'AnnotationAction', 'annotationBody',
  'LinkAction', 'TagAction', 'ClassifyAction', 'Project', 'UploadAction', 'CreateProjectAction',
  'UpdateProjectAction', 'CreateProfileAction', 'UpdateProfileAction', 'DeleteProjectAction',
  'CreateReleaseAction', 'CreatePeriodicalAction', 'MimeDetectionAction', 'ImageProcessingAction',
  'AudioVideoProcessingAction', 'RdfaConversionAction', 'CsvwAction', 'SemanticTaggingAction'
].map(x => `sa:${x}`);
let propList = [
  'range', 'domain', 'seeAlso', 'equivalentProperty', 'equivalentClass', 'subClassOf', 'source'
];
function desa () {
  let $dl = document.querySelector('#scholarly-article > dl')
    , seenFormula = false
  ;
  sa.defines.forEach(def => {
    let id = def['@id'];
    if (~skipList.indexOf(id)) return;
    let $dt = document.createElement('dt');
    $dt.id = id.replace(/^sa:/, '');
    $dt.textContent = id;
    $dt.className = def['@type'].replace(/^rdf:/, '');
    $dl.appendChild($dt);
    let $dd = document.createElement('dd');
    if (def.comment) {
      let $p = document.createElement('p');
      $p.textContent = def.comment;
      $dd.appendChild($p);
    }
    let $ul = document.createElement('ul');
    propList.forEach(prop => {
      if (def[prop]) {
        let $li = document.createElement('li');
        $li.textContent = `${prop}: ` + (Array.isArray(def[prop]) ? def[prop] : [def[prop]]).join(', ');
        $ul.appendChild($li);
      }
    });
    $dd.appendChild($ul);
    $dl.appendChild($dd);
  });
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
  desa();
  detoc();
  deref();
  defigure();
  deontology();
}
if (document.readyState === 'complete') despec();
else document.addEventListener('DOMContentLoaded', despec, false);
