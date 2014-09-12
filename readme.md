[![build status](https://secure.travis-ci.org/toddself/dr-sax.png)](http://travis-ci.org/toddself/dr-sax)

# Dr. SAX

Dr. SAX is an HTML to markdown converter that uses a [SAX-based parser](http://github.com/fb55/htmlparser2) to convert HTML to markdown. (SAX to MD.  SAX MD? DR SAX? GET IT?!)

![your project name is bad and you should feel bad](http://i.imgur.com/qgxiLco.png)

It presents both a standard (non-streaming) and transform stream interface for converting HTML to markdown.

## Installing

`npm install --save dr-sax`

## Usage

_Non-Streaming_

```javascript
> var DrSax = require('dr-sax');
> var drsax = new DrSax();
> drsax.write('<p>Wow, this is an <b>awesome</b> HTML parser dude! You should <a href="http://yahoo.com">submit it to yahoo!</a>');
"\n\nWow, this is an **awesome** HTML parser dude! You should [submit it to yahoo!](http://yahoo.com)\n\n"
```

_Streaming_

```javascript
> var transform = require('dr-sax').stream();
> fs.createReadStream('input.html').pipe(transform).pipe(fs.createWriteStream('output.md'));
```

_Stripping out non-Markdown tags_

```javascript
> var DrSax = require('dr-sax');
> var drsax = new DrSax({stripTags: true});
> drsax.write('<span class="txt-center"><b>centered text</b></span>');
"**centered text**"
> var drsax2 = new DrSax();
> drsax2.write('<span class="txt-center"><b>centered text</b></span>');
"<span class=\"txt-center\">**centered text**</span>"
```

_Supply your own markdown dialect_

```javascript
> var dialect = {b: {open: '__', close: '__'}};
> var DrSax = require('dr-sax');
> var drsax = new DrSax({dialect: dialect});
> drsax.write('<p>Wow, this is an <b>awesome</b> HTML parser dude! You should <a href="http://yahoo.com">submit it to yahoo!</a>');
"\n\nWow, this is an __awesome__ HTML parser dude! You should [submit it to yahoo!](http://yahoo.com)\n\n"
```

## Why?
There are a few node.js based html to markdown converters available, why do we need another?

1. [html-md](https://github.com/neocotic/html.md) and [upndown](https://github.com/netgusto/upndown) are both jsdom based for node.js. JSDOM is slow, and [has some memory issues when used in a loop](https://github.com/neocotic/html.md/pull/43)
2. Others use regular expressions to parse your HTML. Why hello Zalgo! Nice to meet you today!

## Benchmarking & Compliance

Benchmarks are available in [Dr. Sax Benchmarks](https://github.com/toddself/dr-sax-benchmarks).

Here are the results for:

```
"dependencies": {
  "benchmark": "~1.0.0",
  "dr-sax": "~1.0.7",
  "hammerdown": "0.0.18",
  "html-md": "~3.0.2",
  "html2markdown": "~1.1.0",
  "pdc": "~0.1.2",
  "to-markdown": "0.0.2",
  "unmarked": "0.0.12",
  "upndown": "~0.0.7"
}
```

On a 2014 quad-core 3.5gHz Core i7 iMac running node 0.10.28

(pdc is using Pandoc 1.12.3)

```
> dr-sax-benchmarks@0.0.0 start /Users/todd/src/dr-sax-benchmarks
> node index

dr sax x 5,838 ops/sec ±1.90% (92 runs sampled)
htmlmd x 228 ops/sec ±4.27% (75 runs sampled)
upndown x 216 ops/sec ±6.05% (83 runs sampled)
to-markdown x 6,696 ops/sec ±5.03% (90 runs sampled)
html2markdown x 2,400 ops/sec ±5.08% (87 runs sampled)
unmarked:
hammerdown x 932 ops/sec ±6.56% (74 runs sampled)
pdc x 24.07 ops/sec ±17.90% (66 runs sampled)
Fastest is to-markdown
```

The fastest is *not* Dr. Sax, but rather [`to-markdown`](https://github.com/domchristie/to-markdown). Alas, `to-markdown` does not handle malformed HTML well as it is based on a regular-expression type parser:

```
> var drsax = new (require('dr-sax'))();
> var bs = '<b>this is a totally<i>Broken</b> string that I want parsed';
> drsax.write(bs);

'**this is a totally_Broken_** string that I want parsed'

> var tomd = require('to-markdown').toMarkdown;
> tomd(bs);

'**this is a totally<i>Broken** string that I want parsed'
```

Both of the DOM based parsers ([html-md](https://github.com/neocotic/html.md) and [upndown](https://github.com/netgusto/upndown/)) handle that string identically to how Dr. Sax handles it.

[unmarked](https://github.com/tcr/unmarked) does not seem to work correctly however:

```
> var unmarked = require('unmarked');
undefined
> unmarked.parse('<b>test</b>');
'test'
```

## Round Trip Conversion

The test [tests/throughput-compliance.js](throughput-compliance.js) attempts to test HTML -> Markdown -> HTML conversion using the following Markdown -> HTML converters:

* [Gruber](http://daringfireball.net/projects/markdown)
* [Marked](https://github.com/chjj/marked)
* [CommonMark](https://github.com/jgm/stmd) (via [my fork](https://github.com/toddself/stmd) which allows installation via NPM)
* [Markdown-JS](https://github.com/evilstreak/markdown-js)

Currently Markdown-JS is considered (by me) non-conforming Markdown -> HTML renderers due to its handling of block-level `<iframe>` tags. Its lack of conformance is not due to how Dr. Sax generates its output.  

These are being tracked by:
* [markdown-js bug 212](https://github.com/evilstreak/markdown-js/issues/212)
* <span style="text-decoration: line-through">[stmd bug 88](https://github.com/jgm/stmd/issues/88)</span> **resolved**

The issue is pretty simple:

Given the following input

```html
<p>I am a <strong>paragraph</strong> of text</p>
<iframe></iframe>
```

Dr Sax will create the following Markdown

```markdown
I am a **paragraph** of text

<iframe></iframe>
```

Both Gruber and Marked accept this input and regenerate the original input HTML. However, stmd and Markdown-js output:

```html
<p>I am a <strong>paragraph</strong> of test</p>

<p><iframe></iframe></p>
```

Wrapping the `<iframe>` tag in an extraneous `<p>` tag makes them very hard to style appropriately without doing crazy tricks, so I'm going to side with Gruber and Marked on this case and recommend them for rendering Markdown.

However, there are some caveats and quirks being that Markdown is a whitespace significant language and HTML is not.

The primary munging occurs if your input is pretty-printed HTML.

```html
<h1>Why use <a href="https://github.com/toddself/dr-sax/">Dr. Sax</a></h1>
<ol>
  <li>Because you like puns!</li>
  <li>Because you need speed</li>
</ol>
<strong>This is going to be bold!</strong>
<h2>Kittens</h2>Look at these funny little furry things!
<iframe width="560" height="315" src="//www.youtube.com/embed/h_hKJCe_-sI" frameborder="0" allowfullscreen></iframe>
```

This will convert to the following markdown

```markdown
# Why use [Dr. Sax](https://github.com/toddself/dr-sax/)

1. Because you like puns!
1. Because you need speed


**This is going to be bold!**

## Kittens

Look at these funny little furry things!<iframe width="560" height="315" src="//www.youtube.com/embed/h<em>hKJCe</em>-sI" frameborder="0" allowfullscreen=""></iframe>
```

But, will convert back to the following HTML (using [marked](https://github.com/chjj/marked))

```html
<h1 id="why-use-dr-sax-https-github-com-toddself-dr-sax-">Why use <a href="https://github.com/toddself/dr-sax/">Dr. Sax</a></h1>
<ol>
<li>Because you like puns!</li>
<li>Because you need speed</li>
</ol>
<p><strong>This is going to be bold!</strong></p>
<h2 id="kittens">Kittens</h2>
<p>Look at these funny little furry things!<iframe width="560" height="315" src="//www.youtube.com/embed/h_hKJCe_-sI" frameborder="0" allowfullscreen=""></iframe></p>
```

The `tab` characters from the `<ol>` are missing, and the `<iframe>` and `<strong>` tags are wrapped in paragraphs.  This is a result of how Markdown's dialect handles block-level elements like the `<ol>` and `<h2>` tags in the page.

There is a specially formatted test to verify round-trip results in the test suite for compliance.

## Dialects
Custom dialects can be supplied to the parser. You can get a general concept of how they're defined by looking at [dialect.js](dialect.js).

A dialect is an object with the top-level keys being the HTML tags you're trying to convert. Each of these points to an object with an `open` and `close` key, which is the markdown token to insert instead of the `open`ing HTML tag, and the one use instead of the `close`ing tag. You can omit a tag by just using an empty string. If the tag is indentable (like `<blockquote>`), set that flag to `true`. If the tag is a block-level element, set that flag to `true` as well so that the correct line-spacing will be entered.  If the tag requires attributes to be parsed, create a new key called `attrs` which is an object explaining how to deal with the attributes for that tag.

**e.g.**
The anchor tag is `<a href="url">captured text</a>`, but in markdown you need `[captured text](url)`.

This is defined as:

```javascript
{
  a: {
    open: '',
    close: '',
    attrs: {
      text: {
        open: '[',
        close: ']'
      },
      href: {
        open: '(',
        close: ')'
      }
    }
  }
}
```

The nodes in `attrs` are processed in order -- so since the "text" (which is anything in the `captured text` section) needs to come first, we list it first. And since the text needs to be wrapped in `[` and `]`, we note those as the open and close.  Same goes for the `href` tag. Since that completes the entire tag, we actually leave the `open` and `close` for the `<a>` itself empty since it requires no additional tokens.

## Testing

The test script will, by default, download the Markdown package from Gruber's site, unzip it and include spawning his parser as well. If you do not wish to test against Gruber, don't have a Perl intepreter installed, etc, you by skip these tests by setting `NOGRUBER=true` on the command line before running the tests.

```
git clone git@github.com:toddself/dr-sax
cd dr-sax
npm install
npm test
NOGRUBER=true npm test
```

## License
Dr. Sax is ©2014 Todd Kennedy. Available for use under the [MIT License](LICENSE).
