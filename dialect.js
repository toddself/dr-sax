module.exports = {
  br: {
    open: '\n',
    close: '\n'
  },
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
    close: ''  
  },
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
    block: true,
    open: '# ',
    close: false
  },
  h2: {
    block: true,
    open: '## ',
    close: false
  },
  h3: {
    block: true,
    open: '### ',
    close: false
  },
  h4: {
    block: true,
    open: '#### ',
    close: false
  },
  h5: {
    block: true,
    open: '##### ',
    close: false
  },
  h6: {
    block: true,
    open: '###### ',
    close: false
  }
};