import { FC, memo, useContext, useEffect, useState } from "react"
import React from "react"
import {
  Button,
  Form,
  Switch,
  Select,
  Checkbox,
  Popconfirm,
  message,
} from "antd"
import DrawC from "../DrawC/DrawC"
import DrawProvider from "./provider/DrawProvider"
import MainContent from "./components/MainContent"
import Sidebar from "./components/Sidebar"
import MainContentVocabulary from "./components/MainContentVocabulary"
import { ContentDrawLesson } from "./DrawLesson"
import { useAppSelector } from "../../app/hooks"

interface DrawLessonProps {
  button: React.ReactNode
  title: string
  data: any
}

interface ContentDrawExamProps {
  data?: any
}

const ContentDrawExam: FC<ContentDrawExamProps> = ({ data }) => {
  const [fb, setFB] = useState<any>(null)
  const categories = useAppSelector((state) => state.app.categories)
  const [loading, setLoading] = useState(false)

  console.log("loading", loading)

  const options = categories
    .filter((item: any) => item.group == "skills")
    ?.map((category: any) => ({
      value: category._id,
      label: category.name_category,
    }))

  const delay = (ms: number) =>
    new Promise((resolve: any, reject: any) => setTimeout(resolve("abc")))

  const handleChange = async (value: any) => {
    setLoading(false)
    await delay(1000)
    setFB({
      _id: data?._id,
      category_id: value,
      type_category: categories.find((item: any) => item._id == value)?.type,
    })
    setLoading(true)
  }

  return (
    <div className="h-full">
      <div className="">
        <label className="block" htmlFor="">
          Chọn phần thi
        </label>
        <Select
          style={{ width: 200 }}
          onChange={handleChange}
          options={options}
        />
      </div>
      {loading ? (
        <DrawProvider>
          <ContentDrawLesson data={fb} />
        </DrawProvider>
      ) : (
        <></>
      )}
    </div>
  )
}

const DrawExam: FC<DrawLessonProps> = ({ button, title, data }) => {
  return (
    <DrawC
      title={
        <p>
          Quản lí bài kiểm tra Lesson: <b>{data?.name_lesson}</b>
        </p>
      }
      button={button}
      data={data}
      children={(action) => <ContentDrawExam {...action} data={data} />}
    />
  )
}

export default DrawExam
