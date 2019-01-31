/**
 * @file             : dist/fnkGenerator.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 30.01.2019
 * Last Modified Date: 30.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { baseGenerator } = require('astring')

function formatSequence(state, nodes) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state
  state.write('(')
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state)
    const { length } = nodes
    for (let i = 1; i < length; i++) {
      const param = nodes[i]
      state.write(', ')
      generator[param.type](param, state)
    }
  }
  state.write(')')
}


exports.fnkGenerator = Object.assign({}, baseGenerator, {
  Identifier: function(node, state) {

      const { writeComments } = state

      state.write(node.name, node)

      if (writeComments && node.comments != null && node.comments.length ) {
          state.write(' /* ' + node.comments[0].value + " */")
      }
  },
  FunctionDeclaration: function(node,state) {

      const { writeComments } = state

      state.write('function ' + node.id.name, node)
      formatSequence(state, node.params)
      state.write(' ')

      if( writeComments && node.body.comments ) {
          state.write('/* ' + node.body.comments[0].value + ' */')
          node.body.comments = null
      }

      this[node.body.type](node.body, state)
  }
});


