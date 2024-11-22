import React, { FC, useContext, useEffect, useRef } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { _log } from "../../utils/_log"
import { MaskLoader } from "../Loader"
import { FormInstance } from "antd/lib"
import { api } from "../../_helper"
import { context } from "../Draw/provider/DrawProvider"
import { _questionType } from "../../utils/_constant"
import { IconC } from "../IconC"
import { deleteQuestionById } from "../../services/questionServices"
import { deleteTestResult } from "../../services/testResultServices"

interface ModalquestionProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  lesson_id: string
  test_id: string
  width?: number
  height?: number
  refresh?: any
}

export const question_type_models = [
  {
    title: "Trắc nghiệm - nhiều đáp án",
    desc: "Cho phép tạo câu hỏi trắc nghiệm có nhiều câu trả lời và chỉ được chọn 1 đáp án đúng",
    type: _questionType?.choice,
    icon: "FaListCheck",
    template:
      "https://res.cloudinary.com/dzpj1y0ww/image/upload/v1728720056/ielts/4a374bae-fbbd-4389-a29f-f01c77d47189.png",
  },

  {
    title: "Tự luận",
    desc: "Cho phép tạo câu hỏi yêu cầu trả lời chi tiết bằng văn bản",
    type: _questionType?.fill_in_blanks,
    icon: "MdOutlineTextRotationNone",
    template:
      "https://res.cloudinary.com/dzpj1y0ww/image/upload/v1728720120/ielts/a3534689-7bc0-4292-8462-ae05ec8ff55f.png",
  },
]

const ModalForm: FC<{
  action: any
  type: "add" | "update" | "delete"
  data?: any
  lesson_id: string
  test_id: string
  refresh?: any
}> = ({ action, type, data, lesson_id, refresh, test_id }) => {
  const { drawStore, dispath } = useContext<any>(context)
  const [typeQuestion, setTypeQuestion] = React.useState<any>(null)

  const handleSelectTypeQuestion = (data: any) => {
    setTypeQuestion(data)
  }

  const handleConfirm = () => {
    const question_type = typeQuestion?.type
    dispath({
      type: "SET_QUESTION_TYPE",
      payload: question_type,
    })
  }

  const handleDeleteQuetions = async () => {
    try {
      const question_id = drawStore?.question?._id
      const sub_question_id = drawStore?.sub_question_select?.question_id
      const sub_question = drawStore?.sub_question_select
      await deleteQuestionById(question_id, sub_question, lesson_id)
      await deleteTestResult(test_id, sub_question_id)
      refresh?.()
      action?.closeModal()
      api?.message?.success("Xóa câu hỏi thành công")
    } catch (error) {}
  }

  useEffect(() => {
    setTypeQuestion(question_type_models[0])
  }, [])
  return (
    <div className={`wrapper flex ${type != "delete" ? "min-h-[570px]" : ""}`}>
      {type === "delete" ? (
        <div className="flex items-center gap-7">
          <p>Bạn có chắc chắn muốn xóa câu hỏi này không?</p>
          <div className="flex gap-2">
            <Button
              variant="solid"
              color="danger"
              icon={<CloseOutlined />}
              onClick={action?.onCancel}
            >
              Hủy
            </Button>
            <Button onClick={handleDeleteQuetions}>Xác nhận</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="wp_questionType w-[50%] pr-3">
            {question_type_models.map((item, index) => {
              const active =
                typeQuestion?.type === item.type ? "bg-green-100" : ""
              return (
                <div
                  key={index}
                  className={`font-medium text-[16px] flex items-center justify-start p-3 gap-3 hover:bg-gray-100 cursor-pointer ${active}`}
                  onClick={() => {
                    handleSelectTypeQuestion(item)
                  }}
                >
                  <IconC name={item.icon} size={20} />
                  <div className="title">{item.title}</div>
                </div>
              )
            })}
            <Button
              onClick={() => {
                dispath?.({
                  type: "SET_QUESTION_SELECT",
                  payload: null,
                })
                dispath?.({
                  type: "SET_CONFIRM_CREATE_TYPE_QUESTION",
                })
                dispath({
                  type: "SET_TYPE_ACTION",
                  payload: "add",
                })
                handleConfirm()
                action?.closeModal()
              }}
              type="primary"
              className="w-full p-5 mt-5"
            >
              Xác nhận
            </Button>
          </div>
          <div className="wp_content flex-1 flex flex-col gap-3">
            <h3 className="font-bold text-base"> {typeQuestion?.title}</h3>
            <p>{typeQuestion?.desc}</p>
            <h3 className="font-bold text-base">Câu hỏi mẫu</h3>
            <div className="border p-3 min-h-[80px] flex items-center justify-center">
              <img width={300} height={300} src={typeQuestion?.template} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const ModalQuestion: FC<ModalquestionProps> = ({
  button,
  title,
  type,
  data,
  modalProps,
  lesson_id,
  refresh,
  test_id,
  width = 800,
  height = 600,
}) => {
  return (
    <ModalCView
      modalProps={{
        width: 800,
        ...modalProps,
      }}
      button={button}
      title={title}
      children={(action) => (
        <ModalForm
          test_id={test_id}
          refresh={refresh}
          data={data}
          action={action}
          type={type}
          lesson_id={lesson_id}
        />
      )}
    />
  )
}

export default ModalQuestion
