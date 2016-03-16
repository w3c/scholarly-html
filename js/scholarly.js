
import sa from '@scienceai/scholarly-article';

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
    if (id === 'sa:Formula') seenFormula = true;
    if (!seenFormula) return; // skip everything until Formula
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
