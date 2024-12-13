import React, { FC, useContext, useEffect, useRef, useState } from "react"
import { ModalCView } from "../ModalC/ModalC"
import { FormC } from "../FormC"
import { an } from "vitest/dist/types-e3c9754d.js"
import { Button, Col, message, Modal, Row, Upload } from "antd"
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"

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
import axios from "..//..//services/axiosInstance"
import { createVoc, deleteVoc, updateVoc } from "../../services/vocServices"
import { _app } from "../../utils/_app"

const { TextArea } = Input
interface ModaltestProps {
  button: React.ReactNode
  title: string
  type: "add" | "update" | "delete"
  data?: any
  modalProps?: any
  lesson_id?: string
  type_category?: string
  test_id?: string
  refresh?: any
}

const ModalForm: FC<{
  action: any
  type: "add" | "update" | "delete"
  data?: any
  lesson_id?: string
  type_category?: string
  refresh?: any
  test_id?: string
}> = ({ action, type, data, lesson_id, refresh, type_category, test_id }) => {
  const { drawStore, dispath } = useContext<any>(context)
  console.log("type", type != "add")


  console.log('====================================');
  console.log("test_id", test_id);
  console.log('====================================');

  const formRef = useRef<FormInstance<any>>(null)
  const editorRef = useRef<any>(null) // Store the editor instance
  const [audioUrl, setAudioUrl] = useState<string | null>("")
  const question = drawStore?.question
  const [formData, setFormData] = useState<any>({
    img_voc: data?.img_voc ?? "",
    sound_voc: data?.sound_voc ?? "",
  })



  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [fileList, setFileList] = useState<any>([])

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl)
    setPreviewVisible(true)
  }

  useEffect(() => {
    if (data?.img_voc) {
      setFileList([
        {
          uid: "-1", // unique id for the file
          name: "image.png", // name of the file
          status: "done", // status of the upload (done/finished)
          url: data?.img_voc, // URL of the image
        },
      ])
    }
  }, [])

  const handleChange = ({ fileList }: any) => setFileList(fileList)

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res: any = await axios.post("/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setFormData({
        ...formData,
        img_voc: res?.url,
      })

      onSuccess(res.data) // Đảm bảo thành công
    } catch (err) {
      onError({ err })
    }
  }

  // Hàm kiểm tra định dạng file (chỉ cho phép ảnh)
  const beforeUpload = (file: any) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    if (!isImage) {
      message.error("Bạn chỉ có thể upload file ảnh (JPG/PNG)!")
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!")
    }

    return isImage && isLt2M // Chỉ cho phép upload nếu điều kiện đúng
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const handleSetFormData = (name: string, value: string) => {


    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAdd = async (fb: any) => {
    const data = {
      ...formData,
      ...fb,
      test_id,
    }

    try {
      await createVoc(data)
      api?.message?.success("Thêm từ vựng thành công !")
      refresh?.()
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleUpdate = async (fb: any) => {
    try {
      await updateVoc(data?._id, {
        ...formData,
        ...fb,
      })
      refresh?.()
      action?.closeModal()

      api?.message?.success("Sửa từ vựng thành công !")
      action?.closeModal()
    } catch (error) {
      _log("erro")
    }
  }
  const handleDelete = async (fb: any) => {
    try {
      await deleteVoc(data?._id)
      refresh?.()

      api?.message?.success("xóa  từ vựng  thành công !!")
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
      name: "name_voc",
      type: "input",
      label: "Từ vựng",
      placeholder: "Nhập từ vựng",
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
    {
      name: "type_voc",
      type: "select",
      label: "Loại từ",
      placeholder: "Chọn loại từ",
      options: [
        {
          title: "Danh từ- Noun",
          value: "noun",
        },
        {
          title: "Động từ- Verb",
          value: "verb",
        },
        {
          title: "Tính từ- Adjective",
          value: "adjective",
        },
        {
          title: "Trạng từ- Adverb",
          value: "adverb",
        },
        {
          title: "Giới từ- Preposition",
          value: "preposition",
        },
        {
          title: "Liên từ- Conjunction",
          value: "conjunction",
        },
        {
          title: "Thán từ- Interjection",
          value: "interjection",
        },
      ],
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
    {
      name: "pronun_voc",
      type: "input",
      label: "IPA",
      placeholder: "Nhập Phiên âm",
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
    {
      name: "meaning_voc",
      type: "input",
      label: "Nghĩa",
      placeholder: "Nhập Nghĩa của từ",
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
    {
      name: "explain_voc",
      type: "input",
      label: "Giải Thích",
      placeholder: "Nhập Giải thích của từ",
      rules: [
        {
          required: true,
          message: "Không được để trống",
        },
      ],
    },
    {
      name: "exm_voc",
      type: "input",
      label: "Ví dụ",
      placeholder: "Nhập Giải ví dụ của từ",
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
          <p>Bạn có chắc chắn muốn xóa từ vựng này không?</p>

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
            chunk={2}
            chunkWidth={1}
            fields={fields}
            onFinish={onFinish}
          />
          {/* Hình ảnh */}

          <Row className="items-center">
            <Col span={12}>
              <label htmlFor="">Hình ảnh</label>
              <Upload
                customRequest={customRequest} // Gọi API upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload} // Validation định dạng file
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Col>
            <Col span={12}>
              <label htmlFor="">Phát âm</label>

              <UploadAudio
                initialUrl={data?.sound_voc}
                setUrl={(url: string) => {
                  handleSetFormData("sound_voc", url)
                }}
              />
            </Col>
          </Row>

          {/* Preview Modal */}

          {/* Phát âm */}

          <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
          <div className="flex items-end justify-end mt-10">
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

const ModalVoc: FC<ModaltestProps> = ({
  button,
  title,
  type,
  data,
  modalProps,

  test_id,
  refresh,
}) => {
  return (
    <ModalCView
      modalProps={{
        width: 700,
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
          test_id={test_id}
        />
      )}
    />
  )
}

export default ModalVoc
