module.exports = {
  b: {
    open: '**',
    close: '**'
  },
  strong: {
    open: '**',
    close: '**'
  },
  em: {
    open: '_',
    close: '_'
  },
  i: {
    open: '_',
    close: '_'
  },
  img: {
    open: '!',
    close: '',
    attrs: {
      alt: {
        open: '[',
        close: ']'
      },
      src: {
        open: '(',
        close: ')'
      }
    }
  },
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
  },
  blockquote: {
    indent: '> ',
    open: '> ',
    block: true,
    close: ''
  },
  code: {
    open: '```\n',
    close: '\n```',
    block: true
  },
  pre: {
    open: '`',
    close: '`'
  },
  p: {
    block: true,
    open: '',
    close: ''
  },
  ol: {
    indent: '\t',
    block: true,
    open: '',
    close: ''
  },
  ul: {
    indent: '\t',
    block: true,
    open: '',
    close: ''  },
  olli: {
    open: '1. ',
    close: '\n'
  },
  ulli: {
    open: '* ',
    close: '\n'
  },
  hr: {
    block: true,
    open: '- - -',
    close: ''
  },
  h1: {
    open: '\n# ',
    close: '\n'
  },
  h2: {
    open: '\n## ',
    close: '\n'
  },
  h3: {
    open: '\n### ',
    close: '\n'
  },
  h4: {
    open: '\n#### ',
    close: '\n'
  },
  h5: {
    open: '\n##### ',
    close: '\n'
  },
  h6: {
    open: '\n###### ',
    close: '\n'
  }
};