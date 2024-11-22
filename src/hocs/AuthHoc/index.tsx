import { ReactNode, useEffect } from "react"
import storage from "../../utils/storage"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { history } from "../../_helper"
import { routeConfig } from "../../configs/routeConfig"
import { InitialScreen } from "../../conponents/InitialScreen"
import { _app } from "../../utils/_app"
import { _log } from "../../utils/_log"
import { setUserAccess } from "../../features/user/userSlice"
import { MaskLoader } from "../../conponents/Loader"

interface IProps {
  children: ReactNode
}

export const AuthHoc: React.FC<IProps> = ({ children }) => {
  const { isAuth, userInfo } = useAppSelector((state) => state?.user?.access)
  const dispatch = useAppDispatch()

  const initData = async () => {
    // _app.setUserAuthed(true)

    _app.getInitialData
      ?.all()
      .then((fb) => {
        _log("APP INITIAL SUCCESS")
        _app.setUserAuthed(true)
      })
      .catch((error) => {
        _log("APP INITIAL ERROR", error)
      })
      .finally(() => {})
  }

  useEffect(() => {
    const refeshToken = storage.getRefreshToken()

    if (!refeshToken) {
      history?.navigate?.(routeConfig?.login)
    }

    initData()
  }, [])



  return (
    <>
      <InitialScreen isFadeOut />
      {children}
    </>
  )
}
