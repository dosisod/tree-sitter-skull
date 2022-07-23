[
  (string)
  (rune)
] @string

(comment) @comment

(func_expr
  (identifier) @function)

(type) @type

[
  (int)
  (float)
] @number

[
  (bool)
] @constant.builtin

[
  "+"
  "-"
  "*"
  "/"
  "and"
  "or"
  "xor"
  "is"
  "isnt"
  "not"
  "-"
  "&"
  "<<"
  ">>"
  "^"
  "<"
  ">"
  "<="
  ">="
] @operator

[
  "break"
  "continue"
  "noop"
  "return"
  "unreachable"
  "while"
  "if"
  "elif"
  "else"
  "namespace"
  "mut"
  "export"
] @keyword

[
  "{"
  "}"
  "("
  ")"
] @punctuation.bracket
