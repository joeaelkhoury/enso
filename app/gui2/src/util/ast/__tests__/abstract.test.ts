import { Ast } from '@/util/ast'
import { expect, test } from 'vitest'

//const disabledCases = [
//  ' a',
//]
const cases = [
  'Console.',
  '(',
  '[',
  ']',
  '`',
  'export',
  'export as Foo',
  'export Foo as',
  'export Foo as Bar.Baz',
  'export Foo as Foo, Bar',
  'export Foo as Foo.Bar',
  'export Foo hiding',
  'export Foo hiding X,',
  'foo = (',
  'foo = [',
  'foo = ]',
  'foo ~',
  'foo = 1, 2',
  'foo @ bar',
  'foo@bar',
  'foo = case x of\n 4 ->',
  'foo = case x of\n 4',
  'foo = case x of\n 4->',
  'foo = if cond.x else.y',
  'foreign 4',
  'foreign 4 * 4',
  'foreign foo = "4"',
  'foreign js foo = 4',
  'from export all',
  'from Foo export all hiding',
  'from Foo export all hiding X.Y',
  'from Foo import all hiding',
  'from Foo import all hiding X.Y',
  'from Foo import all What_Is_This_Doing_Here hiding Bar',
  'from import all',
  'from Standard.Base.Data.Array import new as array_new',
  'import',
  'import as Foo',
  'import Foo as',
  'import Foo as Bar.Baz',
  'import Foo as Foo, Bar',
  'import Foo as Foo.Bar',
  'import Foo hiding',
  'import Foo hiding X,',
  'main ~ = x',
  'polyglot import Foo',
  'polyglot java import',
  'splice_outside_text = `',
  'type',
  '=-',
  'x =-',
  'x = y +-',
  'x =- y',
  'x = y +- z',
  'x = +- z',
  '=- y',
  'export Foo as Bar',
  'export prj.Data.Foo',
  'foo a b c = x',
  ':',
  'a ',
  'a \n',
  "'''\n and some \\u000Aescapes\\'",
  'a = \n x',
  '[]',
  '.',
  '{}',
  'foo : [Integer | Text] -> (Integer | Text)',
  'from Foo export all hiding Bar, Baz',
  'from Foo export Bar, Baz',
  'from Standard.Base import all',
  'from Standard.Base import all hiding Number, Boolean',
  'from Standard.Base import Foo, Bar, Baz',
  'f (~x = 1) = x',
  'f (x = 1) = x',
  'f ~x=1 = x',
  'f x=1 = x',
  'f (x = y)',
  'f x=y',
  'import project.IO',
  'import Standard.Base as Enso_List',
  "'''\n    \\nEscape at tart\n",
  'Point x_val = my_point',
  'type Foo\n Bar (a : B =C.D)',
  'type Foo\n ## Bar\n Baz',
  'x = """\n    Indented multiline\nx',
  "x =\n x = '''\n  x\nx",
  'x + + + x',
  'x + + x',
  '.log',
  'polyglot java import java.lang.Float',
  'polyglot java import java.net.URI as Java_URI',
  '\\a b -> x',
  '\\v -> v',
  '0.0.x',
  '0b10101010',
  '0b',
  '0o122137',
  '0o',
  '0xAE2F14',
  '0x',
  '1 .0',
  '1. 0',
  '100_000',
  '10_000.99',
  '1 . 0',
  '16_17ffffffffffffffa',
  '-1.up_to 100',
  '+1 + x',
  '_+1 + x',
  '-1.x',
  '2_01101101',
  '-2_01101101',
  '-2.1',
  '(a) (b)',
  '(a b)',
  '# a b c',
  '((a b) c)',
  'a b c',
  '+ a',
  'a +',
  'a |> f',
  '@a\n@b\nx',
  '@a z\n@b\nx',
  "'''",
  '@Builtin_Type\ntype Date',
  'f : A->B -> x',
  'f:A->B -> x',
  'v : A -> _ + x',
  'v:A->x',
  'v : A -> x -> x',
  'v : A -> x->x',
  'v:A->x->x',
  'f <| a',
  'f default',
  'f default x = x',
  'foo a b =',
  'foo a b c =',
  'foo a =',
  'foo a b = x',
  'foo a = x',
  "foo = bar '''\n baz",
  'foo =',
  'foo = x',
  'foo _ = x',
  'foreign python my_method a b = "42"',
  'FREEZE x.f',
  'FREEZE x.f y',
  'FREEZE x',
  'FREEZE x + y',
  'f -x',
  'f x default = x',
  'f ~_ = x',
  'f x->\n y',
  'Id.id x = x',
  'if True then\n True',
  'if True then True else False',
  'if True then True else\n False',
  'increment = 1 +',
  'main = # define main\n 4',
  '.map (+2 * 3) *7',
  '_.map (_+2 * 3) _*7',
  "'''\n \\t'",
  '-Number.positive_infinity',
  "'''\n x\n \\t'",
  '@on_problems P.g\nTable.select_columns : Text -> Table',
  'pi = 3.14',
  'private',
  'private func',
  '(")")',
  '"Inline raw text"',
  '`',
  "('\\n')",
  '"Non-escape: \\n"',
  '"Non-escape: \\"',
  "'Other quote type'",
  "'Simple case.'",
  "'` SpliceWithLeadingWhitespace`'",
  "'String with \\' escape'",
  "'String with \\n escape'",
  '"type"',
  "'\\U0000000Aescape'",
  "'\\u{0000A}escape'",
  "'\\u000Aescape'",
  "'\\u0915\\u094D\\u0937\\u093F'",
  'unclosed = "a',
  'unclosed = "',
  "'\\u'",
  "'\\U'",
  "'With a `splice`.'",
  "'\\x0Aescape'",
  "'\\x'",
  'zero_length = ""',
  'SKIP x.f',
  'SKIP x.f y',
  'SKIP x',
  'SKIP x + y',
  '.sum 1',
  '_.sum 1',
  '@Tail_Call go\n a\n b',
  '@Tail_Call go t',
  'type A a=0',
  'type A\n @a z\n @b\n x',
  'type Bool',
  'type Existing_Headers (column_names : Vector Text)',
  'type Foo (a : Int)',
  'type Option (a)',
  'type Option a',
  'Vector _ = x',
  'x - 1 + 2',
  'x=-1',
  'x)',
  '(x',
  '(-x)',
  'x ->\n y',
  'x->\n y',
  '-x',
  'x=-x',
  '-x*x',
  '-x+x',
  '-(x * x)',
  'x = y+-',
  'x=-y',
  'x -> y',
  'x-> y',
  'x->y',
  'x y . f v',
  'x = y+-z',
  'x->y-> z',
  'x --> y ---> z',
  'x <| y <<| z',
  'x + y + z',
  'x = +-z',
  'val : Bool',
  'val = foo (x : Int)',
  'val : List Int',
  'val = x : Int',
  'w + x + y * z',
  '[x]',
  '(- x)',
  '- x',
  '{x}',
  'x : List Int -> Int',
  '(x : My_Type _)',
  '- (x * x)',
  'x - x',
  'x-x',
  '[ x , y ]',
  '[x, y]',
  'x.-y',
  'x.~y',
  '{x, y}',
  '[ x , y , z ]',
  '[x, y, z]',
  'x + y * z',
  'x * y + z',
  ["'''", ' `splice` at start'].join('\n'),
  ['case a of', '    Some -> x', '    Int -> x'].join('\n'),
  [
    'case a of',
    '    ## The Some case',
    '    Some -> x',
    '    ## The Int case',
    '    Int -> x',
  ].join('\n'),
  ['case a of', '    Vector_2d x y -> x'].join('\n'),
  ['case foo of', '    v:My_Type -> x', '    v:(My_Type _ _) -> x'].join('\n'),
  ['case self of', '    Vector_2d ... -> x'].join('\n'),
  ['case self of', '    Vector_2d -> x', '    _ -> x'].join('\n'),
  ['foo', '    bar'].join('\n'),
  ['foo =', '    ', 'bar'].join('\n'),
  ['foo =', 'bar'].join('\n'),
  ['foo', '    + bar +'].join('\n'),
  ['foo', '    + bar', '        - baz'].join('\n'),
  ['main =', '    foo', 'bar'].join('\n'),
  ['main =', '  foo', ' bar', '  baz'].join('\n'),
  ['main =', '  foo', ' bar', 'baz'].join('\n'),
  ['main ~foo = x'].join('\n'),
  ['main =', '      ', '    x'].join('\n'),
  ['main =', '    ', '    x'].join('\n'),
  ['main =', '    x'].join('\n'),
  ['main =', '  ', '    x'].join('\n'),
  ['main =', '', '    x'].join('\n'),
  ['rect1', '    . width = 7', '    . center', '        + x'].join('\n'),
  ['type A', '    Foo (a : Integer, b : Integer)'].join('\n'),
  ['type Geo', '    number =', '        x', '    area self = x + x'].join('\n'),
  ['type Result error ok=Nothing', '    Ok value:ok = Nothing'].join('\n'),
  ['value = nums', '    * each random', '    + constant'].join('\n'),
  ['# Some comment', '# Other comment', '', 'private'].join('\n'),
  ['main =', '    +x', '    print x'].join('\n'),
  [
    '## The Identity Function',
    '',
    '   Arguments:',
    '   - x: value to do nothing to',
    'id x = x',
  ].join('\n'),
  [
    'type Foo',
    '    + : Foo -> Foo -> Foo',
    '    + self b = b',
    '    Foo.+ : Foo',
    '    Foo.+ self b = b',
  ].join('\n'),
  ['type Foo', ' ## Test indent handling', '  ', ' foo'].join('\n'),
  ['type Foo', '    type Bar', '    type Baz'].join('\n'),
  [
    'type Geo',
    '    Circle',
    '        radius : float',
    '        x',
    '    Rectangle width height',
    '    Point',
    '',
    '    number =',
    '        x',
    '    area self = x + x',
  ].join('\n'),
  [
    'type Geo',
    '    Circle',
    '        radius',
    '        x',
    '    Rectangle width height',
    '    Point',
  ].join('\n'),
  [
    'type Problem_Builder',
    '    ## Returns a vector containing all reported problems, aggregated.',
    '    build_problemset : Vector',
    '    build_problemset self =',
    '        self',
  ].join('\n'),
  ['type T', '', 'private'].join('\n'),
  ['value = foo', '    bar'].join('\n'),
  ['value = foo', '    +x', '    bar'].join('\n'),
  ['###', ' x'].join('\n'),
]
test.each(cases)('parse/print round trip: %s', (code) => {
  // Get an AST.
  const root = Ast.parse(code)
  // Print AST back to source.
  const printed = Ast.print(root)
  const info1 = printed.info
  expect(printed.code).toEqual(code)

  // Re-parse.
  const root1 = Ast.parse(printed)
  // Check that Identities match original AST.
  // FIXME--Needed for AST edits (#8367).
  /*
  const reprinted = root1.print()
  expect(reprinted.info).toEqual(info1)
   */
})

const parseCases = [
  { code: 'foo bar+baz', tree: ['', [['foo'], [['bar'], '+', ['baz']]]] },
  { code: '(foo)', tree: ['', ['(', ['foo'], ')']] },
]
test.each(parseCases)('parse: %s', (testCase) => {
  const root = Ast.parse(testCase.code)
  expect(Ast.debug(root)).toEqual(testCase.tree)
})

// TODO: Edits (#8367).
/*
if (false) {
  test('insert new node', () => {
    const code = 'main =\n    text1 = "foo"\n'
    const root = Ast.parse(code)
    const main = Ast.functionBlock('main')
    expect(main).not.toBeNull()
    insertNewNodeAST(main!, 'baz', '42')
    const printed = root.print()
    expect(printed.code).toEqual('main =\n    text1 = "foo"\n    baz = 42\n')
  })

  test('replace expression content', () => {
    const code = 'main =\n    text1 = "foo"\n'
    const root = Ast.parse(code)
    const main = Ast.functionBlock('main')
    expect(main).not.toBeNull()
    const newAssignment = insertNewNodeAST(main!, 'baz', '42')
    replaceExpressionContentAST(newAssignment.value, '23')
    const printed = root.print()
    expect(printed.code).toEqual('main =\n    text1 = "foo"\n    baz = 23\n')
  })

  test('delete expression', () => {
    const originalCode = 'main =\n    text1 = "foo"\n'
    const root = Ast.parse(originalCode)
    const main = Ast.functionBlock('main')
    expect(main).not.toBeNull()
    const newAssignment = insertNewNodeAST(main!, 'baz', '42')
    deleteExpressionAST(newAssignment.assignment)
    const printed = root.print()
    expect(printed.code).toEqual(originalCode)
  })
}
 */
