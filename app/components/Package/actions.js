import { createAction } from 'redux-actions'
import api from '../../backendAPI'
export const PACKAGE_UPDATE_LIST = 'PACKAGE_UPDATE_LIST'
export const updatePackageList = createAction(PACKAGE_UPDATE_LIST, list => list)


export const fetchPackageList = () => dispatch => {
  api.fetchPackageList()
  .then(list => dispatch(updatePackageList(list)))
}

export const PACKAGE_UPDATE_LOCAL = 'PACKAGE_UPDATE_LOCAL'
export const PACKAGE_TOGGLE = 'PACKAGE_TOGGLE'

// 往本地localstoage写一个插件的信息

export const updateLocalPackage = createAction(PACKAGE_UPDATE_LOCAL, p => p)


export const togglePackage = createAction(PACKAGE_TOGGLE, (pkgId, shouldEnable) => {
  const script = localStorage.getItem(pkgId)
  if (!shouldEnable) {
    // plugin will unmount
    window.extensions[pkgId].manager.pluginOnUnmount()
    delete window.extensions[pkgId]
  } else {
    // plugin will mount
    try {
      const plugin = eval(script)
      const { Manager = '' } = plugin
      const manager = new Manager()
      manager.pluginWillMount()
      plugin.manager = manager
      window.extensions[pkgId] = plugin
    } catch (err) {
      throw err
    }
  }
  return ({
    id: pkgId,
    shouldEnable,
  })
})

export const fetchPackage = (pkgId) => (dispatch) => {
  const pkgInfo = api.fetchPackageInfo(pkgId)
  const pkgScript = api.fetchPackageScript(pkgId)
    .then(script => {
      localStorage.setItem(pkgId, script)
      return pkgId
    })
  if (window.extensions[pkgId]) {
    dispatch(togglePackage(pkgId, false))
  }
  Promise.all([pkgInfo, pkgScript]).then(([pkg, id]) => {
    dispatch(updateLocalPackage({
      ...pkg,
      enabled: Boolean(window.extensions[pkgId]),
      id
    }))
    dispatch(togglePackage(pkgId, true))
  })

    // return api.fetchPackageScript(pkgId, __PACKAGE_SERVER__)
    // .then(script => {
    //   const storageKey = `CodingPackage___${pkgId}`
    //   localStorage.setItem(storageKey, script)
    //   dispatch(updateLocalPackage, {

    //   })
    //   return storageKey
    // })
  // const pkgInfo = api.fetchPackageInfo(pkgId)
  // const pkgScript = api.fetchPackageScript(pkgId)
  //   .then(script => {
  //     const storageKey = `CodingPackage___${pkgId}`
  //     localStorage.setItem(storageKey, script)
  //     return storageKey
  //   })
  // Promise.all([pkgInfo, pkgScript]).then(([pkg, storageKey]) => {
  //   dispatch(updateLocalPackage({ ...pkg, storageKey, enabled: true }))
  // })
}

export const PACKAGE_ACTIVATE_EXTENSION = 'PACKAGE_ACTIVATE_EXTENSION'
export const activateExtenstion = createAction(PACKAGE_ACTIVATE_EXTENSION)
