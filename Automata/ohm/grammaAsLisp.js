module.exports = function(grammar) {
	const semantics = grammar.createSemantics()

	semantics.addAttribute('asLisp', {
		AddExp_plus: function(x, _, y) {
			return ['+', x.asLisp, y.asLisp];
		},
		AddExp_minus: function(x, _, y) {
			return ['-', x.asLisp, y.asLisp];
		},
		MulExp_times: function(x, _, y) {
			return ['*', x.asLisp, y.asLisp];
		},
		MulExp_divide: function(x, _, y) {
			return ['/', x.asLisp, y.asLisp];
		},
		ExpExp_power: function(x, _, y) {
			return ['pow', x.asLisp, y.asLisp];
		},
		PriExp_paren: function(_l, e, _r) {
			return e.asLisp;
		},
		PriExp_pos: function(_, e) {
			return e.asLisp;
		},
		PriExp_neg: function(_, e) {
			return ['neg', e.asLisp];
		},
		ident: function(_l, _ns) {
			return this.sourceString;
		},
		number: function(_) {
			return this.sourceString;
		},
		/*
		  When you create an operation or an attribute, you can optionally provide a `_nonterminal`
		  semantic action that will be invoked when your action dictionary does not have a method that
		  corresponds to the rule that created a CST node. The receiver (`this`) of the _nonterminal
		  method will be that CST node, and `_nonterminal`'s only argument will be an array that contains
		  the children of that node.
		*/
		_nonterminal: function(children) {
			if (children.length === 1) {
				// If this node has only one child, just return the Lisp-like tree of its child. This lets us
				// avoid writing semantic actions for the `Exp`, `AddExp`, `MulExp`, `ExpExp`, and `PriExp`
				// rules.
				return children[0].asLisp;
			} else {
				// If this node doesn't have exactly one child, we probably should have handled it specially.
				// So we'll throw an exception to let us know that we're missing a semantic action for this
				// type of node.
				throw new Error("Uh-oh, missing semantic action for " + this.constructor);
			}
		}
	});

	return semantics
}