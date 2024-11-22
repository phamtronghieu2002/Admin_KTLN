import React, { FC, useContext, useRef } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"
import { an } from "vitest/dist/types-e3c9754d.js"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import {
  addLesson,
  deleteLesson,
  updateLesson,
} from "../../services/lessonService"
import { _log } from "../../utils/_log"
import { context } from "../../pages/Manager/ManagerCategories/Provider/ManagerCategoryProvider"
import { MaskLoader } from "../Loader"
import { FormInstance } from "antd/lib"
import { api } from "../../_helper"

interface ModalLessonProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  category_id?: string
}

const ModalForm: FC<{
  action: any
  type: "add" | "update" | "delete"
  data?: any
  category_id?: string
}> = ({ action, type, data, category_id }) => {
  const { storeCategories, dispath } = useContext<any>(context)

  const formRef = useRef<FormInstance<any>>(null)

  const handleAdd = async (fb: any) => {
    try {
      const name_lesson = fb?.name_lesson
      dispath({ type: "loading", payload: true })
      await addLesson({
        name_lesson,
        cate_id: category_id ?? "",
      })
      dispath({ type: "SET_REFRESH" })

      dispath({ type: "SET_LOADING", payload: false })
      api?.message?.success("Thêm bài học thành công")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleUpdate = async (fb: any) => {
    try {
      const name_lesson = fb?.name_lesson
      dispath({ type: "loading", payload: true })
      await updateLesson({
        name_lesson,
        id: data?._id,
      })
      dispath({ type: "SET_REFRESH" })
      dispath({ type: "SET_LOADING", payload: false })
      api?.message?.success("Sửa bài học thành công")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleDelete = async (fb: any) => {
    try {
      dispath({ type: "loading", payload: true })
      await deleteLesson(data?._id)
      dispath({ type: "SET_REFRESH" })
      dispath({ type: "SET_LOADING", payload: false })
      api?.message?.success("xóa  bài học thành công")
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
      name: "name_lesson",
      type: "input",
      label: "Tên",
      placeholder: "Nhập tên bài học",
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
      {storeCategories?.loading && <MaskLoader />}
      {type === "delete" ? (
        <div className="flex items-center gap-7">
          <p>Bạn có chắc chắn muốn xóa bài học này không?</p>

          <div className="flex gap-2">
            <Button
              variant="solid"
              color="danger"
              icon={<CloseOutlined />}
              onClick={action?.closeModal}
            >
              Hủy
            </Button>
            <Button onClick={onFinish}>Xác nhận</Button>
          </div>
        </div>
      ) : (
        <>
          <FormC
            ref={formRef}
            initialValues={data}
            chunk={1}
            chunkWidth={1}
            fields={fields}
            onFinish={onFinish}
          />
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

const ModalLesson: FC<ModalLessonProps> = ({
  button,
  title,
  type,
  data,
  modalProps,
  category_id,
}) => {
  return (
    <ModalCView
      modalProps={{
        width: 400,
        ...modalProps,
      }}
      button={button}
      title={title}
      children={(action) => (
        <ModalForm
          data={data}
          action={action}
          type={type}
          category_id={category_id}
        />
      )}
    />
  )
}

export default ModalLesson
