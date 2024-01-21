// https://github.com/TypeStrong/typedoc/issues/2273#issuecomment-1537164006
// CC0
// @ts-check
import td from 'typedoc'

// Plugin which, given a file like this:
//
// ```ts
// /**
//  * {@displayType ReturnType}
//  * @param x {@displayType 123}
//  * @param y {@displayType `{ copied directly }`}
//  * @typeParam T {@removeType }
//  */
// export function foo<T extends { a: 1; b: { c: 2 } }>(x: T, y: T): string { return "" }
// ```
//
// Will display documentation as if it was:
// ```ts
// export function foo<T>(x: 123, y: { copied directly }): ReturnType;
// ```

/** @param {td.Application} app */
export const load = function (app) {
  // Automatically add `@displayType` and `@removeType` to the list of allowed inline tags
  // if not present. We use an inline tag so that it can be included multiple times in a comment
  // and included inside blocks that will be attached to different reflections.
  app.on(td.Application.EVENT_BOOTSTRAP_END, () => {
    const tags = [...app.options.getValue('inlineTags')]
    if (!tags.includes('@displayType')) {
      tags.push('@displayType')
    }
    if (!tags.includes('@removeType')) {
      tags.push('@removeType')
    }
    app.options.setValue('inlineTags', tags)
  })

  app.converter.on(
    td.Converter.EVENT_RESOLVE,
    /**
     * @param {td.Context} context
     * @param {td.DeclarationReflection
     *   | td.TypeParameterReflection
     *   | td.ParameterReflection
     *   | td.SignatureReflection} refl
     */
    (context, refl) => {
      if (!refl.comment) return

      const index = refl.comment.summary.findIndex(
        (part) =>
          part.kind === 'inline-tag' &&
          ['@displayType', '@removeType'].includes(part.tag),
      )

      if (index === -1) return

      const removed = refl.comment.summary.splice(index, 1)
      const part = /** @type {td.InlineTagDisplayPart} */ (removed[0])

      // Clean up the existing type so that the project can be serialized/deserialized without warnings
      refl.type?.visit(
        td.makeRecursiveVisitor({
          reflection(r) {
            context.project.removeReflection(r.declaration)
          },
        }),
      )

      if (part.tag === '@removeType') {
        delete refl.type
      } else {
        // @displayType
        refl.type = new td.UnknownType(part.text.replace(/^`*|`*$/g, ''))
      }
    },
  )
}
// prettier-ignore-start
