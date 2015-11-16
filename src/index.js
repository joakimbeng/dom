import most from 'most'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
const {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video,
} = require(`hyperscript-helpers`)(h)

import {getDomElement} from './utils'
import {
  makeElementSelector,
  makeElementSelectorById,
  makeElementSelectorByClassName,
  makeElementSelectorByTagName
} from './elementSelectors'
import parseTree from './parseTree'

const validateDOMDriverInput =
  view$ => {
    if (!view$ || typeof view$.observe !== `function`) {
      throw new Error(`The DOM driver function expects as input an ` +
        `Observable of virtual DOM elements`)
    }
  }

const makeDOMDriver =
  (container, modules = [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
    require(`snabbdom/modules/style`),
  ]) => {
    const patch = snabbdom.init(modules)
    const rootElem = getDomElement(container)

    const DOMDriver =
      view$ => {
        validateDOMDriverInput(view$)

        const rootElem$ =
          most.create(
            add =>
              view$
                .flatMap(parseTree)
                .reduce(
                  (prevView, newView) => {
                    patch(prevView, newView)
                    add(newView.elm)
                    return newView
                  }
                  , rootElem
                )
          )
        rootElem$.drain()

        return {
          select: makeElementSelector(rootElem$),
          selectBy: {
            id: makeElementSelectorById(rootElem$),
            className: makeElementSelectorByClassName(rootElem$),
            tagName: makeElementSelectorByTagName(rootElem$),
          },
        }
      }

    return DOMDriver
  }

export {
  makeDOMDriver,
  h,
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video
}
