import React, { FC, useContext, useRef, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"

import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import { _log } from "../../utils/_log"
import { MaskLoader } from "../Loader"
import { FormInstance } from "antd/lib"
import { api } from "../../_helper"
// import {
//   addQuestionToTips,
//   addTipsToLesson,
//   createTips,
//   deleteTips,
//   updateTips,
// } from "../../services/TipsService"
import TinyMCEEditor from "../Markdown/Markdown"
import UploadAudio from "./components/UploadAudio"
import { Input } from "antd"
import {
  createQuestion,
  updateQuestionById,
} from "../../services/questionServices"
import { context } from "../Draw/provider/DrawProvider"
import { createTip, deleteTip, updateTip } from "../../services/tipServices"
import { _app } from "../../utils/_app"

const { TextArea } = Input
interface ModalTipsProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  lesson_id?: string
  category_id: string
  refresh?: any
}

const ModalForm: FC<{
  action: any
  type: "add" | "update" | "delete"
  data?: any
  lesson_id?: string
  category_id: string
  refresh?: any
}> = ({ action, type, data, lesson_id, refresh, category_id }) => {
  const formRef = useRef<FormInstance<any>>(null)

  const handleAdd = async (fb: any) => {
    try {
      const { name_tip } = fb
      await createTip({
        cate_id: category_id,
        contents: {
          name_tip,
          id_tip: _app?.randomId(),
          content: "",
        },
      })

      refresh?.()
      api?.message?.success("Thêm Tips thành công")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleUpdate = async (fb: any) => {
    try {
      const { name_tip } = fb
      const tip_update = {
        cate_id: category_id,
        contents: {
          name_tip,
          id_tip: data?.id_tip,
          content: data?.content,
        },
      }
      await updateTip(tip_update)

      action?.closeModal()
      refresh?.(tip_update)
    
      api?.message?.success("Thêm Tips thành công")
    } catch (error) {
      _log("erro")
    }
  }
  const handleDelete = async (fb: any) => {
    try {
        await deleteTip(data?.id_tip)
        action?.closeModal()
        refresh?.()
        api?.message?.success("xóa  bài Tips  thành công !!")
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
      name: "name_tip",
      type: "input",
      label: "Tên tips",
      placeholder: "Nhập tên  Tips",
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
          <p>Bạn có chắc chắn muốn xóa bài Tips này không?</p>

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

const ModalTips: FC<ModalTipsProps> = ({
  button,
  title,
  type,
  data,
  modalProps,
  lesson_id,
  category_id,
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
          category_id={category_id}
        />
      )}
    />
  )
}

export default ModalTips
