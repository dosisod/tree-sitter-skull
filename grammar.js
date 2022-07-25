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

    noop_stmt: $ => prec.left('noop'),
    unreachable_stmt: $ => prec.left('unreachable'),
    break_stmt: $ => prec.left('break'),
    continue_stmt: $ => prec.left('continue'),

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

    add_expr: $ => prec.left(seq($.expr, '+', $.expr)),
    sub_expr: $ => prec.left(seq($.expr, '-', $.expr)),
    mult_expr: $ => prec.left(seq($.expr, '*', $.expr)),
    div_expr: $ => prec.left(seq($.expr, '/', $.expr)),
    lshift_expr: $ => prec.left(seq($.expr, '<<', $.expr)),
    rshift_expr: $ => prec.left(seq($.expr, '>>', $.expr)),
    pow_expr: $ => prec.left(seq($.expr, '^', $.expr)),

    and_expr: $ => prec.left(seq($.expr, 'and', $.expr)),
    or_expr: $ => prec.left(seq($.expr, 'or', $.expr)),
    xor_expr: $ => prec.left(seq($.expr, 'xor', $.expr)),
    is_expr: $ => prec.left(seq($.expr, 'is', $.expr)),
    isnt_expr: $ => prec.left(seq($.expr, 'isnt', $.expr)),
    lt_expr: $ => prec.left(seq($.expr, '<', $.expr)),
    lte_expr: $ => prec.left(seq($.expr, '<=', $.expr)),
    gt_expr: $ => prec.left(seq($.expr, '>', $.expr)),
    gte_expr: $ => prec.left(seq($.expr, '>=', $.expr)),
    not_expr: $ => prec.left(seq('not', $.expr)),

    unary_negate_expr: $ => prec.left(seq('-', $.expr)),
    ref_expr: $ => prec.left(seq('&', $.expr)),
    deref_expr: $ => prec.left(seq('*', $.expr)),

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
          optional(
            repeat(seq(',', $.expr))
          )
        ),
      ),
      ')'
    )),

    identifier: $ => /[A-Za-z](\.?[A-Za-z0-9_])*/,
    new_identifier: $ => /[A-Za-z][A-Za-z0-9_]*:/,
    type: $ => alias($.identifier, 'type'),

    int: $ => choice(
      /-?\d+/,
      /0b[10_]+/,
      /0o[0-7_]+/,
      /0x[A-Fa-f0-9_]+/
    ),

    float: $ => choice(
      /-?[0-9]+\.[0-9]+/,
      /-?Infinity/
    ),

    bool: $ => choice(
      'true',
      'false'
    ),

    rune: $ => seq(
      '\'',
      /./, // TODO: add escape sequence support
      '\''
    ),

    string: $ => seq(
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

    comment: $ => choice(
      /\#.*/,
      seq('#{', repeat(/./), '#}')
    )
  }
});
