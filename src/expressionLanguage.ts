import * as ohm from 'ohm-js';

const grammarSource = String.raw`
  Arithmetic {
    Exp = AddExp
    AddExp = AddExp "+" PriExp  -- plus
           | AddExp "-" PriExp  -- minus
           | PriExp
    PriExp = "(" Exp ")"  -- paren
           | number
    constant = "" | ""
    number = digit+
  }
`;

// Instantiate the grammar defined above.
const g = ohm.grammar(grammarSource);

// Define an operation named 'eval' which evaluates the expression.
// See https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#semantics
const semantics = g.createSemantics().addOperation('eval', {
    Exp(e) {
        return e.eval();
    },
    AddExp(e) {
        return e.eval();
    },
    AddExp_plus(left, op, right) {
        return left.eval() + right.eval();
    },
    AddExp_minus(left, op, right) {
        return left.eval() - right.eval();
    },
    PriExp(e) {
        return e.eval();
    },
    PriExp_paren(open, exp, close) {
        return exp.eval();
    },
    number(chars) {
        return parseInt(this.sourceString, 10);
    },
});