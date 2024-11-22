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
  console.log("type", type != "add")

  const formRef = useRef<FormInstance<any>>(null)
  const editorRef = useRef<any>(null) // Store the editor instance
  const [audioUrl, setAudioUrl] = useState<string | null>("")
  const question = drawStore?.question

  const [formData, setFormData] = useState<any>({
    name_test: "",
    question_text: type != "add" ? question?.question_text : "",
    description: type != "add" ? question?.description : "",
    audio_url: "",
    questions: [],
  })

  const [errors, setErrors] = useState<any>({})

  console.log("errors >>>", errors)

  const handleSetFormData = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const validation = () => {
    if (type_category === "Vocabulary") {
      if (!formData?.description) {
        setErrors({
          description: !formData?.description ? "Không được để trống !" : "",
        })
        return false
      }
    } else {
      if (type_category === "Listening") {
        if (
          !formData?.question_text ||
          !formData?.description ||
          !formData?.audio_url
        ) {
          setErrors({
            question_text: !formData?.question_text
              ? "Không được để trống !"
              : "",
            description: !formData?.description ? "Không được để trống !" : "",
            audio_url: !formData?.audio_url ? "Vui Lòng chọn files !" : "",
          })
          return false
        }
      } else {
        if (!formData?.question_text || !formData?.description) {
          setErrors({
            question_text: !formData?.question_text
              ? "Không được để trống !"
              : "",
            description: !formData?.description ? "Không được để trống !" : "",
          })
          return false
        }
      }
    }

    return true
  }

  const handleAdd = async (fb: any) => {
    try {
      if (!validation()) return
      const { name_test } = formData
      const res = await createTest({
        name_test,
        type_category: type_category,
      })
      const test = res.data
      const test_id = test?._id

      await addTestToLesson(lesson_id ?? "", test_id)
      const q = await createQuestion(formData)
      dispath({
        type: "SET_QUESTION",
        payload: q?.data,
      })

      dispath({
        type: "SET_TEST_ID",
        payload: test_id,
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
      await deleteTest(data?._id, type_category)
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
  const onFinish = (values: any) => {
    getActions(type, values)?.onOK()
  }

  return (
    <div>
      {type === "delete" ? (
        <div className="flex items-center gap-7">
          <p>Bạn có chắc chắn muốn xóa bài test này không?</p>

          <div className="flex gap-2">
            <Button
              variant="solid"
              color="danger"
              icon={<CloseOutlined />}
              onClick={action?.onCancel}
            >
              Hủy
            </Button>
            <Button onClick={onFinish}>Xác nhận</Button>
          </div>
        </div>
      ) : (
        <>
          <FormC
            onChange={handleSetFormData}
            ref={formRef}
            initialValues={data}
            chunk={1}
            chunkWidth={1}
            fields={fields}
            onFinish={onFinish}
          />
          <div className="heading_test mb-5">
            {type_category != "Vocabulary" && (
              <label htmlFor="">Nhập đề bài</label>
            )}
            {type_category === "Listening" ? (
              <>
                {" "}
                <UploadAudio
                  setUrl={(url: string) => {
                    handleSetFormData("audio_url", url)
                  }}
                />
                <div className="text-rose-500">{errors?.audio_url}</div>
                <label htmlFor="">Transcript</label>
                {/* text area antd */}
                <TextArea
                  value={formData?.question_text}
                  onChange={(e) => {
                    handleSetFormData("question_text", e.target.value)
                  }}
                  rows={4}
                />
                <div className="text-rose-500">{errors?.question_text}</div>
              </>
            ) : (
              type_category != "Vocabulary" && (
                <>
                  <TinyMCEEditor
                    initialValue={formData?.question_text}
                    onChange={(e: any) => {
                      handleSetFormData("question_text", e)
                    }}
                    ref={editorRef}
                  />
                  <div className="text-rose-500"> {errors?.question_text}</div>
                </>
              )
            )}
            <label htmlFor="">Miêu tả</label>
            {/* text area antd */}
            <TextArea
              placeholder="Nhập miêu tả"
              value={formData?.description}
              onChange={(e) => {
                handleSetFormData("description", e.target.value)
              }}
              rows={4}
            />
            <div className="text-rose-500">{errors?.description}</div>
          </div>

          <div className="flex items-end justify-end">
            <Button
              onClick={() => {
                formRef?.current?.submit()
              }}
              type="primary"
            >
              {getActions(type, action)?.title}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const ModalTest: FC<ModaltestProps> = ({
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

export default ModalTest
