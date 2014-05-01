module.exports = {
  b: {
    open: '**',
    close: '**'
  },
  i: {
    open: '*',
    close: '*'
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
    indent: true,
    open: '\n\n> ',
    close: '\n\n'
  },
  code: {
    open: '\n\n```\n',
    close: '\n```\n\n'
  },
  pre: {
    open: '`',
    close: '`'
  },
  p: {
    open: '',
    close: '\n\n'
  },
  ol: {
    indent: true,
    open: '\n\n',
    close: '\n\n'
  },
  ul: {
    indent: true,
    open: '\n\n',
    close: '\n\n'
  },
  olli: {
    open: '1.',
    close: '\n'
  },
  ulli: {
    open: '*',
    close: '\n'
  },
  hr: {
    open: '\n\n- - -\n\n',
    close: ''
  },
  h1: {
    open: '# ',
    close: '\n\n'
  },
  h2: {
    open: '## ',
    close: '\n\n'
  },
  h3: {
    open: '### ',
    close: '\n\n'
  },
  h4: {
    open: '#### ',
    close: '\n\n'
  },
  h5: {
    open: '##### ',
    close: '\n\n'
  },
  h6: {
    open: '###### ',
    close: '\n\n'
  }
};