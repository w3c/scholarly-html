
let refs = {
  NYT: `
  <dd property="schema:citation" typeof="schema:ScholarlyArticle"
      resource="http://www.scribd.com/doc/224608514/The-Full-New-York-Times-Innovation-Report">
    <cite property="schema:name"><a href="http://www.scribd.com/doc/224608514/The-Full-New-York-Times-Innovation-Report">The
      Full New York Times Innovation Report</a></cite>,
    by
    <span property="schema:author" typeof="schema:Person">
      <span property="schema:name">New York Times</span>
    </span>;
    <time property="schema:datePublished" datetime="2014-03" datatype="xsd:gYearMonth">2014 Mar</time>.
  </dd>
  `,

  HTML: `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="http://www.w3.org/TR/html5/">
    <cite property="schema:name"><a href="http://www.w3.org/TR/html5/">One of the HTML
    Specifications</a></cite>.
  </dd>
  `,

  'WAI-ARIA': `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="https://www.w3.org/TR/wai-aria/complete">
    <cite property="schema:name"><a href="https://www.w3.org/TR/wai-aria/complete">Accessible Rich
    Internet Applications (WAI-ARIA) 1.0</a></cite>.
  </dd>
  `,

  'DPUB-ARIA': `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="http://w3c.github.io/aria/aria/dpub.html">
    <cite property="schema:name"><a href="http://w3c.github.io/aria/aria/dpub.html">Digital
    Publishing WAI-ARIA Module 1.0</a></cite>.
  </dd>
  `,

  'RDFa': `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="https://www.w3.org/TR/rdfa-primer/">
    <cite property="schema:name"><a href="https://www.w3.org/TR/rdfa-primer/">RDFa 1.1
    Primer</a></cite>.
  </dd>
  `,

  'schema.org': `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="http://schema.org/">
    <cite property="schema:name"><a href="http://schema.org/">schema.org</a></cite>.
  </dd>
  `,

  'CSL': `
  <dd property="schema:citation" typeof="schema:WebPage"
      resource="http://citationstyles.org/">
    <cite property="schema:name"><a href="http://citationstyles.org/">Citation Styles
    Language</a></cite>.
  </dd>
  `,
};
export default refs;
