import { FC, useEffect, useRef, useState } from "react"
import { Button, Input } from "antd"
import TinyMCEEditor from "../../../conponents/Markdown/Markdown"
import {
  addPrivacyTerm,
  getPrivacyTerm,
} from "../../../services/privacyService"
import { api } from "../../../_helper"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { IconC } from "../../../conponents/IconC"

//policy components
interface PolicyProps {}

const Policy: FC<PolicyProps> = () => {
  const [data, setData] = useState<any>({
    policy: "",
    term: "",
  })

  const fetchData = async () => {
    try {
      const res = await getPrivacyTerm()

      const policy = res?.data?.find((item: any) => item?.type === "privacy")
      console.log("====================================")
      console.log("policy", policy)
      console.log("====================================")
      const term = res?.data?.find((item: any) => item?.type === "term")
      setData({
        policy: policy?.contents,
        term: term?.contents,
      })
    } catch (error) {
      api?.message?.error("Lỗi hệ thống")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSetPolicy = (value: string) => {
    setData({
      ...data,
      policy: value,
    })
  }
  const handleSetTerm = (value: string) => {
    setData({
      ...data,
      term: value,
    })
  }
  const editorRef = useRef<any>(null) // Store the editor instance

  const handleSave = async () => {
    try {
      await addPrivacyTerm({
        contents: data?.policy,
        type: "privacy",
      })
      await addPrivacyTerm({
        contents: data?.term,
        type: "term",
      })
      api?.message?.success("Lưu thành công")
    } catch (error) {
      api?.message?.error("Lưu thất bại")
    }
  }

  return (
    <div className="wrapper">
      <div className="content flex">
        <div className="wp_policy p-3">
          <h1 className="text-lg mb-4">Chính sách của App</h1>
          <div className="actions mb-4 flex justify-end"></div>
          <div className="content">
            <TinyMCEEditor
              height={500}
              onChange={handleSetPolicy}
              ref={editorRef}
              initialValue={data?.policy}
            />
          </div>
        </div>
        <div className="wp_term p-3">
          <h1 className="text-lg mb-4">Điểu khoản của App</h1>
          <div className="actions mb-4 flex justify-end"></div>
          <div className="content">
            <TinyMCEEditor
              height={500}
              onChange={handleSetTerm}
              ref={editorRef}
              initialValue={data?.term}
            />
          </div>
        </div>
      </div>
      <div className="actions flex justify-end">
        <Button
          onClick={handleSave}
          type="primary"
          className="w-56 bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Lưu
        </Button>
      </div>
    </div>
  )
}

// notifcation components

// feedback components

interface FeedbackProps {}
const Feedback: FC<FeedbackProps> = () => {
  const [value, setValue] = useState<string>("")

  const fetchData = async () => {
    try {
      const res = await getPrivacyTerm()

      const fb = res?.data?.find((item: any) => item?.type === "email")

      setValue(fb?.contents)
    } catch (error) {
      api?.message?.error("Lỗi hệ thống")
    }
  }

  const handleSave = async () => {
    try {
      await addPrivacyTerm({
        contents: value,
        type: "email",
      })

      api?.message?.success("Lưu thành công")
    } catch (error) {
      api?.message?.error("Lưu thất bại")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
      <h1 className="mb-3">Cài đặt email nhận phản hồi từ khách hàng !!!</h1>
      <Input
        className="w-[30%] mr-3"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nhập email"
      />
      <Button onClick={handleSave} type="primary">
        Lưu
      </Button>
    </div>
  )
}

// main
interface AppSettingProps {}
const onChange = (key: string) => {
  console.log(key)
}

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Chính sách và điều khoản",
    children: <Policy />,
    icon: <IconC name="MdOutlinePolicy" />,
  },
  {
    key: "2",
    label: "Thông Báo",
    children: <IconC name="MdCircleNotifications" />,
    icon: <IconC name="MdCircleNotifications" />,
  },
  {
    key: "3",
    label: "Phản hồi",
    children: <Feedback />,
    icon: <IconC name="FaReplyAll" />,
  },
]
const AppSetting: FC<AppSettingProps> = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default AppSetting
