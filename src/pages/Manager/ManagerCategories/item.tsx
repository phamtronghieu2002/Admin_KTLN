import type { TabsProps } from "antd"
import { FC } from "react"
import Lesson from "./components/Lesson"
import Toturials from "./components/Toturial"
import Tips from "./components/Tips"
import LessonExam from "./components/LessonExam"

interface TestProps {}

export const items: (
  category_id: string,
  type_category: string,
  isExam?: boolean,
) => TabsProps["items"] = (
  category_id: string,
  type_category: string,
  isExam: boolean = false,
) =>
  isExam
    ? [
        {
          key: "1",
          label: "Bài học",
          children: (
            <LessonExam category_id={category_id} type_category={type_category} />
          ),
        },
      ]
    : [
        {
          key: "1",
          label: "Bài học",
          children: (
            <Lesson category_id={category_id} type_category={type_category} />
          ),
        },

        {
          key: "2",
          label: "Mẹo",
          children: <Tips category_id={category_id} />,
        },
        {
          key: "3",
          label: "Hướng dẫn",
          children: <Toturials category_id={category_id} />,
        },
      ]
