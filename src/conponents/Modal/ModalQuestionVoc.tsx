import React, { FC, useContext, useRef, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"
import { an } from "vitest/dist/types-e3c9754d.js"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import { _log } from "../../utils/_log"
import { MaskLoader } from "../Loader"
import { FormInstance } from "antd/lib"
import { api } from "../../_helper"
import {
  addQuestionToTest,
  addTestToLesson,
  createTest,
  deleteTest,
  updateTest,
} from "../../services/testService"
import TinyMCEEditor from "../Markdown/Markdown"
import UploadAudio from "./components/UploadAudio"
import { Input } from "antd"
import {
  createQuestion,
  updateQuestionById,
} from "../../services/questionServices"
import { context } from "../Draw/provider/DrawProvider"
import MainContent from "../Draw/components/MainContent"

const { TextArea } = Input
interface ModaltestProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  lesson_id: string
  type_category: string
  refresh?: any
}

const ModalForm: FC<{
  action: any
  type: "add" | "update" | "delete"
  data?: any
  lesson_id: string
  type_category: string
  refresh?: any
}> = ({ action, type, data, lesson_id, refresh, type_category }) => {
  const { drawStore, dispath } = useContext<any>(context)

  const formRef = useRef<FormInstance<any>>(null)
  const editorRef = useRef<any>(null) // Store the editor instance
  const [audioUrl, setAudioUrl] = useState<string | null>("")
  const question = drawStore?.question
  const [formData, setFormData] = useState<any>({
    name_test:"",
    question_text: type != "add" ? question?.question_text : "",
    description: type != "add" ? question?.description : "",
    audio_url:data?.sound_voc || "",
    questions: [],
  })

  const handleSetFormData = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAdd = async (fb: any) => {
    try {
      const { name_test } = formData
      const res = await createTest({
        name_test,
      })
      const test = res.data
      const test_id = test?._id

      await addTestToLesson(lesson_id ?? "", test_id)
      const q = await createQuestion(formData)
      dispath({
        type: "SET_QUESTION",
        payload: test_id,
      })

      dispath({
        type: "SET_TEST_ID",
        payload: q?.data,
      })

      await addQuestionToTest(test_id, q?.data?._id)
      refresh?.({
        ...test,
        value: test?._id,
        label: test?.name_test,
      })
      api?.message?.success("Thêm test thành công")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleUpdate = async (fb: any) => {
    try {
      const name_test = fb?.name_test
      await updateTest({
        name_test,
        id: data?._id,
      })
      const res = await updateQuestionById(question?._id, {
        question_text: formData?.question_text,
        description: formData?.description,
        audio_url: formData?.audio_url,
      })
      const question_fb = res?.data
      dispath({
        type: "SET_QUESTION",
        payload: question_fb,
      })
      refresh?.()

      api?.message?.success("Sửa bài học thành công")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleDelete = async (fb: any) => {
    try {
      await deleteTest(data?._id,type_category)
      refresh?.()

      api?.message?.success("xóa  bài test  thành công !!")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }

  const getActions = (type: string, data: any) => {
    switch (type) {
      case "add":
        return {
          title: "thêm",
          onOK: () => {
            handleAdd(data)
          },
        }
      case "update":
        return {
          title: "sửa",
          onOK: () => {
            handleUpdate(data)
          },
        }

      case "delete":
        return {
          title: "xóa",
          onOK: () => {
            handleDelete(data)
          },
        }

      default:
        break
    }
  }

  const fields = [
    {
      name: "name_test",
      type: "input",
      label: "Tên",
      placeholder: "Nhập tên bài test",
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
  ]
  const onFinish = () => {
    action?.closeModal()
    dispath({
      type: "SET_QUESTION_SELECT",
      payload: null,
    })
  }


  return (
    <MainContent
      data_voc={data}
      onSubmit={onFinish}
      className="w-full"
      lesson_id={lesson_id}
      type_category={type_category}
    />
  )
}

const ModalQuestionVoc: FC<ModaltestProps> = ({
  button,
  title,
  type,
  data,
  modalProps,
  lesson_id,
  type_category,
  refresh,
}) => {
  return (
    <ModalCView
      modalProps={{
        width: 600,
        ...modalProps,
      }}
      button={button}
      title={title}
      children={(action) => (
        <ModalForm
          refresh={refresh}
          data={data}
          action={action}
          type={type}
          lesson_id={lesson_id}
          type_category={type_category}
        />
      )}
    />
  )
}

export default ModalQuestionVoc
