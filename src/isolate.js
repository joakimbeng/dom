import {SCOPE_PREFIX} from './utils'

const isolateSource =
  (source_, scope) =>
    source_.select(`.${SCOPE_PREFIX}${scope}`)

const isolateSink =
  (sink, scope) =>
    sink.map(
      vTree => {
        if (vTree.sel.indexOf(`${SCOPE_PREFIX}${scope}`) === -1) {
          vTree.sel = `${vTree.sel}.${SCOPE_PREFIX}${scope}`
        }
        return vTree
      }
    ).multicast()

export {isolateSink, isolateSource}
