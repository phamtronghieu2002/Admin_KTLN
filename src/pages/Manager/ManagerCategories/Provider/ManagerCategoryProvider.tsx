import { FC } from "react"
import React from "react"
interface ManagerCategoryProviderProps {
  children: React.ReactNode
}
export const context = React.createContext<any>(null)

const ManagerCategoryProvider: FC<ManagerCategoryProviderProps> = ({
  children,
}) => {
  const [storeCategories, setstoreCategories] = React.useState<any>({
    loading: false,
    refresh: 0,
    keyword: "",
  })

  const dispath = (action: any) => {
    switch (action.type) {
      case "SET_REFRESH":
        setstoreCategories((prev: any) => ({
          ...prev,
          refresh: Math.random(),
        }))
        break
      case "SET_LOADING":
        setstoreCategories((prev: any) => ({
          ...prev,
          loading: action?.payload,
        }))
        break
      case "SET_KEYWORD":
        setstoreCategories((prev: any) => ({
          ...prev,
          keyword: action?.payload,
        }))
        break

      default:
        break
    }
  }
  return (
    <context.Provider value={{ storeCategories, dispath }}>
      {children}
    </context.Provider>
  )
}

export default ManagerCategoryProvider
