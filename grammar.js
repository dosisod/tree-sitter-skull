const gen_binary_expr = ($, oper) => prec.left(seq($.expr, oper, $.expr));
const gen_unary_expr = ($, oper) => prec.left(seq(oper, $.expr));

module.exports = grammar({
  name: 'skull',

  word: $ => $.identifier,

  conflicts: $ => [
    [$.func_decl, $.func_expr],
  ],

  rules: {
    source_file: $ => $.stmts,

    stmts: $ => repeat1($._stmt),

    _stmt: $ => choice(
      $.break_stmt,
      $.continue_stmt,
      $.noop_stmt,
      $.return_stmt,
      $.unreachable_stmt,
      $.var_def_stmt,
      $.var_assign_stmt,
      $.func_expr,
      $.while_loop,
      $.if_block,
      $.elif_block,
      $.else_block,
      $.comment,
      $.namespace_block,
      $.func_decl,
      $.external_func_decl,
      $.import_stmt,
    ),

    noop_stmt: _ => prec.left('noop'),
    unreachable_stmt: _ => prec.left('unreachable'),
    break_stmt: _ => prec.left('break'),
    continue_stmt: _ => prec.left('continue'),

    return_stmt: $ => prec.right(
      seq(
        'return',
        optional($.expr)
      )
    ),

    var_def_stmt: $ => seq(
      optional(choice('mut', 'export')),
      choice(
        seq($.identifier, ':=', $.expr),
        seq($.new_identifier, $.type, '=', $.expr),
      ),
    ),

    var_assign_stmt: $ => seq($.identifier, '=', $.expr),

    expr: $ => choice(
      $.float,
      $.int,
      $.rune,
      $.string,
      $.add_expr,
      $.sub_expr,
      $.mult_expr,
      $.div_expr,
      $.unary_negate_expr,
      $.ref_expr,
      $.deref_expr,
      $.paren_expr,
      $.lshift_expr,
      $.rshift_expr,
      $.pow_expr,
      $.and_expr,
      $.or_expr,
      $.xor_expr,
      $.is_expr,
      $.isnt_expr,
      $.not_expr,
      $.lt_expr,
      $.lte_expr,
      $.gt_expr,
      $.gte_expr,
      $.func_expr,
      $.identifier,
      $.bool
    ),

    add_expr: $ => gen_binary_expr($, '+'),
    sub_expr: $ => gen_binary_expr($, '-'),
    mult_expr: $ => gen_binary_expr($, '*'),
    div_expr: $ => gen_binary_expr($, '/'),
    lshift_expr: $ => gen_binary_expr($, '<<'),
    rshift_expr: $ => gen_binary_expr($, '>>'),
    pow_expr: $ => gen_binary_expr($, '^'),

    and_expr: $ => gen_binary_expr($, 'and'),
    or_expr: $ => gen_binary_expr($, 'or'),
    xor_expr: $ => gen_binary_expr($, 'xor'),
    is_expr: $ => gen_binary_expr($, 'is'),
    isnt_expr: $ => gen_binary_expr($, 'isnt'),
    lt_expr: $ => gen_binary_expr($, '<'),
    lte_expr: $ => gen_binary_expr($, '<='),
    gt_expr: $ => gen_binary_expr($, '>'),
    gte_expr: $ => gen_binary_expr($, '>='),

    not_expr: $ => gen_unary_expr($, 'not'),
    unary_negate_expr: $ => gen_unary_expr($, '-'),
    ref_expr: $ => gen_unary_expr($, '&'),
    deref_expr: $ => gen_unary_expr($, '*'),

    paren_expr: $ => seq(
      '(',
      $.expr,
      ')'
    ),

    func_expr: $ => prec.left(seq(
      $.identifier,
      '(',
      optional(
        seq(
          $.expr,
          repeat(seq(',', $.expr))
        ),
      ),
      ')'
    )),

    identifier: _ => /[A-Za-z](\.?[A-Za-z0-9_])*/,
    new_identifier: _ => /[A-Za-z][A-Za-z0-9_]*:/,
    type: $ => alias($.identifier, 'type'),

    int: _ => choice(
      /-?\d+/,
      /0b[10_]+/,
      /0o[0-7_]+/,
      /0x[A-Fa-f0-9_]+/
    ),

    float: _ => choice(
      /-?[0-9]+\.[0-9]+/,
      /-?Infinity/
    ),

    bool: _ => choice('true', 'false'),

    rune: _ => seq(
      '\'',
      /./, // TODO: add escape sequence support
      '\''
    ),

    string: _ => seq(
      '"',
      optional(repeat(/./)), // TODO: add escape sequence support
      '"'
    ),

    while_loop: $ => seq(
      'while',
      $.expr,
      '{',
      $.stmts,
      '}'
    ),

    if_block: $ => seq(
      'if',
      $.expr,
      '{',
      $.stmts,
      '}'
    ),

    elif_block: $ => seq(
      'elif',
      $.expr,
      '{',
      $.stmts,
      '}'
    ),

    else_block: $ => seq(
      'else',
      '{',
      $.stmts,
      '}'
    ),

    namespace_block: $ => seq(
      'namespace',
      $.identifier,
      '{',
      $.stmts,
      '}'
    ),

    _func_param: $ => seq(
      $.new_identifier,
      $.type
    ),

    _func_header: $ => prec.right(seq(
      $.identifier,
      '(',
      optional(
        seq(
          repeat(seq($._func_param, ',')),
          $._func_param
        )
      ),
      ')',
      optional($.type)
    )),

    func_decl: $ => seq(
      optional('export'),
      $._func_header,
      '{',
      $.stmts,
      '}'
    ),

    external_func_decl: $ => seq('external', $._func_header),

    import_stmt: $ => seq('import', $.identifier),

    comment: _ => choice(
      /\#.*/,
      seq('#{', repeat(/./), '#}')
    )
  }
});
