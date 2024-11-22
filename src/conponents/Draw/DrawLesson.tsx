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

interface DrawLessonProps {
  button: React.ReactNode
  title: string
  data: any
}

interface ContentDrawLessonProps {
  data?: any
}

export const ContentDrawLesson: FC<ContentDrawLessonProps> = ({ data }) => {
  const lesson_id = data?._id
  const category_id = data?.category_id
  const type_category = data?.type_category

  return (
    <div className="wrapper flex justify-between bg-slate-100 min-h-full p-3">
      <Sidebar
        lesson_id={lesson_id}
        category_id={category_id}
        type_category={type_category}
      />
      {
        type_category == "Vocabulary" ? (
          <MainContentVocabulary type_category={type_category} lesson_id={lesson_id} />
        ) : (
          <MainContent type_category={type_category} lesson_id={lesson_id} />
        )
      }
    </div>
  )
}

const DrawLesson: FC<DrawLessonProps> = ({ button, title, data }) => {
  return (
    <DrawC
      title={
        <p>
          Quản lí bài kiểm tra Lesson: <b>{data?.name_lesson}</b>
        </p>
      }
      button={button}
      data={data}
      children={(action) => (
        <DrawProvider>
          {" "}
          <ContentDrawLesson {...action} data={data} />{" "}
        </DrawProvider>
      )}
    />
  )
}

export default DrawLesson
