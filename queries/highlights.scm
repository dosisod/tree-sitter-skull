[
  (string)
  (rune)
] @string

(comment) @comment

(func_expr
  (identifier) @function)

(func_decl
  (identifier) @function)

(external_func_decl
  (identifier) @function)

(new_identifier) @variable
(identifier) @variable

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
  "import"
  "external"
] @keyword

[
  "{"
  "}"
  "("
  ")"
] @punctuation.bracket
