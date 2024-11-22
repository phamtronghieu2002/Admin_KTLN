import React, { act } from "react"
import { Question } from "../../Question"
import { _questionType } from "../../../utils/_constant"

interface DrawProviderProps {
  children: React.ReactNode
}
export const context = React.createContext<any>(null)

interface actionType {
  type: string
  payload?: any
}
interface stateProps {
  test_id: string
  question: string
  sub_question_select: any
  freshKey: number
  question_type?: string
  type_action: "add" | "update"
  confirm_create_type_question?: object
}
const initState: stateProps = {
  test_id: "",
  question: "",
  sub_question_select: null,
  freshKey: 0,
  type_action: "add",
  question_type: _questionType?.choice,
  confirm_create_type_question: {},
}

const DrawProvider: React.FC<DrawProviderProps> = ({ children }) => {
  const [drawStore, setDrawStore] = React.useState<any>(initState)

  const dispath = (action: actionType) => {
    switch (action.type) {
      case "SET_TEST_ID":
        setDrawStore((prev: any) => ({
          ...prev,
          test_id: action?.payload,
        }))
        break
      case "SET_QUESTION_SELECT":

        setDrawStore((prev: any) => ({
          ...prev,
          sub_question_select: action?.payload,
        }))
        break
      case "SET_QUESTION":
        setDrawStore((prev: any) => {
          return {
            ...prev,
            question: action?.payload,
          }
        })
        break
      case "SET_QUESTION_VOC":
        setDrawStore((prev: any) => {
          return {
            ...prev,
            question: { ...prev.question, vocURL: action?.payload },
          }
        })
        break
      case "REFRESH":
        setDrawStore((prev: any) => ({
          ...prev,
          freshKey: action?.payload ??Math.random(),
        }))
        break
      case "SET_TYPE_ACTION":
        setDrawStore((prev: any) => ({
          ...prev,
          type_action: action?.payload,
        }))
        break
      case "SET_QUESTION_TYPE":
        setDrawStore((prev: any) => ({
          ...prev,
          question_type: action?.payload,
        }))
        break
      case "SET_CONFIRM_CREATE_TYPE_QUESTION":
     
        setDrawStore((prev: any) => ({
          ...prev,
          confirm_create_type_question: {},
        }))
        break
      default:
        break
    }
  }

  return (
    <context.Provider value={{ drawStore, dispath }}>
      {children}
    </context.Provider>
  )
}

export default DrawProvider
