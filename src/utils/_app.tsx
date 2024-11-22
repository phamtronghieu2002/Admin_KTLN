import { _const } from "../_constant"
import { api, history } from "../_helper"
import { IServerMenu } from "../_types/interfaceType"
import { IUserInfo } from "../_types/userType"
import { store } from "../app/store"
import { routeConfig } from "../configs/routeConfig"
import { Coppy } from "../conponents/Coppy"
import { initAppCategory } from "../features/app/appSlice"
import {
  IRouteModalProps,
  setMenu,
  setRouteModalState,
  // settingApp,
} from "../features/interface/interfaceSlice"
import {
  IUserAccess,
  setCmcServer,
  setDriver,
  setUserAccess,
  setUserChild,
} from "../features/user/userSlice"
import { getCategories } from "../services/categoryServices"
// import { getCmcServerService } from "../services/dev_cmcServerServices"
import { getMenuService } from "../services/interfaceServices"

import {
  deleteUserService,
  disableService,
  getUserChildService,
  getUserInfoService,
  logoutService,
  resetPassService,
} from "../services/userServices"
import { _array } from "./_array"
import { requestFCMToken } from "./firebase"
import { getString } from "./getString"
import storage from "./storage"

type REALTIME_PROMISE_DATA = "gps" | "info" | "alarm"

export const _app = {

  randomId(){
    return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
  getImageUrl: (url: string) => {
    return `${import.meta.env.VITE_SERVER_IELTS_DOMAIN}/files/${url}`
  },
  logout: async () => {
    logoutService().finally(() => {
      storage.clearToken?.()
      window.location.href = routeConfig?.login
      // history.navigate?.(routeConfig?.login)
    })
  },

  cameraFrame: {
    localStorage: {
      setCamNum(num: number) {
        storage.setItem("onlineCamnum", `${num}`)
      },
      getCamNum() {
        const camNum = storage.getItem("onlineCamnum")

        return Number(camNum || 4) || 4
      },
    },
  },

  monitorVehicle: {
    bar: {
      setWidth(width: number) {
        _app?.settingM?.set?.(
          "_monitor_bar_width",
          width || _const?.interface?.map_vehicleFrameWidth,
        )
      },
      getWidth() {
        return (
          _app?.settingM?.get?.("_monitor_bar_width") ||
          _const?.interface?.map_vehicleFrameWidth
        )
      },
    },
  },

  settingM: {
    set(key: string, value: any) {
      const data = storage?.getItem?.(_const?.storeKey?.settingM)
      storage?.setItem(_const?.storeKey?.settingM, { ...data, [key]: value })
    },
    get(key: string) {
      return storage?.getItem?.(_const?.storeKey?.settingM)?.[key]
    },
  },
  setting: (key: string, value: any) => {
    // store.dispatch?.(
    //   settingApp?.({
    //     key: key,
    //     value: value,
    //   }),
    // )
  },
  getSetting: () => {
    return storage.getItem?.(_const?.storeKey?.setting)
  },

  setUserAuthed: (isAuth: boolean) => {
    const dispatch = store.dispatch
    // dispatch(
    //   setUserAccess({
    //     isAuth,
    //   }),
    // )
  },

  getInitialData: {
    categories: async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const fb = await getCategories()
          const data: any = fb?.data
          const dispatch = store.dispatch
          dispatch(initAppCategory(data))
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    },
    userInfo: async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const fb = await getUserInfoService()
          const data: IUserInfo = fb?.data?.[0]
          const dispatch = store.dispatch

          dispatch(
            setUserAccess({
              userInfo: data,
            }),
          )
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    },

    userChild: async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const fb = await getUserChildService()

          const userTree = _array.userChildTree(fb?.data)
          const userRows = fb?.data

          const dispatch = store.dispatch
          dispatch(
            setUserChild({
              child: userTree?.child,
              row: userRows,
              object: userTree?.objectUser,
            }),
          )

          resolve(true)
        } catch (error) {
          // resolve(error)
          reject(error)
        }
      })
    },

    menu: async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const fb = await getMenuService()
          const data: IServerMenu[] = fb?.data
          const dispatch = store.dispatch

          dispatch(setMenu(data))

          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    },

    all: async () => {
      // const userInfoPromise = _app.getInitialData?.userInfo()
 
      const categoriesPromise = _app.getInitialData?.categories()
      return Promise.all([categoriesPromise])
    },
  },


}
