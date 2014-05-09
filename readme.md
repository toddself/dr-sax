[![build status](https://secure.travis-ci.org/toddself/dr-sax.png)](http://travis-ci.org/toddself/dr-sax)

# Dr. SAX

Dr. SAX is an HTML to markdown converter that uses a [SAX-based parser](http://github.com/fb55/htmlparser2) to convert HTML to markdown. (SAX to MD.  SAX MD? DR SAX? GET IT?!)

![your project name is bad and you should feel bad](http://i.imgur.com/qgxiLco.png)

It presents both a standard (non-streaming) and transform stream interface for converting HTML to markdown.

## Why?
There are a few node.js based html to markdown converters available, why do we need another?

1. [html-md](https://github.com/neocotic/html.md) and [upndown](https://github.com/netgusto/upndown) are both jsdom based for node.js. JSDOM is slow, and [has some memory issues when used in a loop](https://github.com/neocotic/html.md/pull/43)
2. Others use regular expressions to parse your HTML. Why hello Zalgo! Nice to meet you today!

## Benchmarking

Benchmarks are available in [Dr. Sax Benchmarks](https://github.com/toddself/dr-sax-benchmarks).

Here are the results for:

```
"dependencies": {
    "dr-sax": "1.0.1",
    "html-md": "3.0.2",
    "pdc": "0.1.2",
    "upndown": "0.0.7"
}
```

On an early 2013 MacBook Pro w/ retina display.

(pdc is using Pandoc 1.12.3)

```
> dr-sax-benchmarks@0.0.0 start /Users/tkenned2/src/dr-sax-benchmarks
> node index

dr sax x 3,945 ops/sec ±1.11% (90 runs sampled)
htmlmd x 150 ops/sec ±3.01% (76 runs sampled)
upndown x 132 ops/sec ±4.32% (74 runs sampled)
pdc x 19.04 ops/sec ±18.95% (54 runs sampled)
Fastest is dr sax
```

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

## Dialects
Custom dialects can be supplied to the parser. You can get a general concept of how they're defined by looking at [dialect.js](dialect.js).

A dialect is an object with the top-level keys being the HTML tags you're trying to convert. Each of these points to an object with an `open` and `close` key, which is the markdown token to insert instead of the `open`ing HTML tag, and the one use instead of the `close`ing tag. You can omit a tag by just using an empty string. If the tag is indentable (like `<blockquote>`), set that flag to `true`. If the tag is a block-level element, set that flag to `true` as well so that the correct line-spacing will be entered.  If the tag requires attributes to be parsed, create a new key called `attrs` which is an object explaining how to deal with the attributes for that tag.

**e.g.**
The anchor tag is `<a href="url">captured text</a>`, but in markdown you need [captured text](url).

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

```
git clone git@github.com:toddself/dr-sax
cd dr-sax
npm install
npm test
```

## License
Dr. Sax is ©2014 Todd Kennedy. Available for use under the [MIT License](LICENSE).
