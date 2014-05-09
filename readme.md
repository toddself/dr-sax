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
"Wow, this is an **awesome** HTML parser dude! You should [submit it to yahoo!](http://yahoo.com)"
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

## Testing

```
git clone git@github.com:toddself/dr-sax
cd dr-sax
npm install
npm test
```

## License
Dr. Sax is ©2014 Todd Kennedy. Available for use under the [MIT License](LICENSE).
