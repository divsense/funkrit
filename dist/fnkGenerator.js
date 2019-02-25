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

      if (writeComments && node.trailingComments != null && node.trailingComments.length ) {
          state.write(' /* ' + node.trailingComments[0].value + " */")
      }
  },
  ArrayPattern: function(node, state) {
      baseGenerator.ArrayPattern(node, state)

      const { writeComments } = state

      if (writeComments && node.trailingComments != null && node.trailingComments.length ) {
          state.write(' /* ' + node.trailingComments[0].value + " */")
      }
  },
  ObjectPattern: function(node, state) {
      baseGenerator.ObjectPattern(node, state)

      const { writeComments } = state

      if (writeComments && node.trailingComments != null && node.trailingComments.length ) {
          state.write(' /* ' + node.trailingComments[0].value + " */")
      }
  },
  ArrowFunctionExpression: function(node, state) {

      const { writeComments } = state
      const { params, leadingComments, trailingComments } = node

      if(writeComments && leadingComments && leadingComments.length) {
          state.write('/* ' + leadingComments[0].value + ' */')
      }

      if (params != null) {
          formatSequence(state, node.params)
      }

      if(writeComments && trailingComments && trailingComments.length) {
          state.write('/* ' + trailingComments[0].value + ' */')
      }

      state.write(' => ')
      if (node.body.type[0] === 'O') {
          // Body is an object expression
          state.write('(')
          this.ObjectExpression(node.body, state)
          state.write(')')
      } else {
          this[node.body.type](node.body, state)
      }

  },
  FunctionDeclaration: function(node,state) {

      const { writeComments } = state

      state.write('function ' + node.id.name, node)
      if( writeComments && node.leadingComments && node.leadingComments.length ) {
          state.write('/* ' + node.leadingComments[0].value + ' */')
      }

      formatSequence(state, node.params)
      state.write(' ')

      if( writeComments && node.trailingComments && node.trailingComments.length ) {
          state.write('/* ' + node.trailingComments[0].value + ' */')
      }

      this[node.body.type](node.body, state)
  }
});


