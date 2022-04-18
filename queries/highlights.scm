(string) @string

(comment) @comment

(func_expr
  (identifier) @function)

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
] @keyword
