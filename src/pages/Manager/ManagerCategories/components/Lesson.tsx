import { FC, useContext, useEffect, useState } from "react"
import { ContentProps } from "./Interface"
import { getLessonByCategory } from "../../../../services/lessonService"
import { _log } from "../../../../utils/_log"
import { TableC } from "../../../../conponents/TableC"
import { render } from "@testing-library/react"
import { Button } from "antd"
import ModalLesson from "../../../../conponents/Modal/ModalLesson"
import { PlusOutlined } from "@ant-design/icons"
import { context } from "../Provider/ManagerCategoryProvider"
import { MaskLoader } from "../../../../conponents/Loader"
import DrawLesson from "../../../../conponents/Draw/DrawLesson"

import { IconC } from "../../../../conponents/IconC"

const Lesson: FC<ContentProps> = ({ category_id, type_category }) => {

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a: any, b: any) => a.name_lesson.length - b.name_lesson.length,
    },
    {
      title: "Tên bài học",
      dataIndex: "name_lesson",
      key: "name_lesson",
      sorter: (a: any, b: any) => a.name_lesson.length - b.name_lesson.length,
    },
    {
      title: "Tổng số câu hỏi",
      dataIndex: "total_question",
      key: "total_question",
      sorter: (a: any, b: any) => a.total_question - b.total_question,
    },
    {
      title: "Tổng số bài test",
      dataIndex: "total_test",
      key: "total_test",
      sorter: (a: any, b: any) => a.total_test - b.total_test,
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render(value: any, record: any, index: any) {
        return (
          <div className="flex flex-row gap-1">
            <ModalLesson
              title={`Sửa bài học ${record?.name_lesson}`}
              button={
                <Button
                  type="link"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  <IconC name={`FaEdit`}  size={20}/>
                </Button>
              }
              type="update"
              data={record}
            />
            <ModalLesson
              modalProps={{
                width: 550,
              }}
              title={`Xóa bài học ${record?.name_lesson}`}
              button={
                <Button className=" border-0 text-white p-2  !text-rose-700">
                  <IconC name={`LiaTrashAlt`}   size={20}/>
                </Button>
              }
              type="delete"
              data={record}
            />
            <DrawLesson
              button={
                <Button
                  type="link"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Quản lý bài test
                </Button>
              }
              title="Cài đặt bài học"
              data={record}
            />
          </div>
        )
      },
    },
  ]
  
  const [lessons, setLessons] = useState<any>([])


  const { storeCategories, dispath } = useContext(context)
  const [loading, setLoading] = useState(false)

  const fetchLessons = async (keyword: string) => {
    setLoading(true)
    const res = await getLessonByCategory(category_id, keyword)

    const lessons = res.data?.map((lesson: any, index: number) => {
      return {
        ...lesson,
        total_test: lesson?.tests?.[0]?._id ? lesson?.tests?.length : 0,
        key: index,
        stt: index + 1,
        category_id,
        type_category,
      }
    })
    setLoading(false)

    setLessons(lessons)
  }

  useEffect(() => {
    fetchLessons(storeCategories?.keyword || "")
  }, [storeCategories?.refresh, storeCategories?.keyword])

  const handleReload = () => {
    fetchLessons("")
  }

  return (
    <div>
      {loading && <MaskLoader />}
      <TableC
        right={
          <div className="flex gap-3">
            <Button onClick={handleReload}>Làm mới</Button>
            <ModalLesson
              category_id={category_id}
              type="add"
              title="Thêm bài học"
              button={
                <Button icon={<PlusOutlined />} type="primary">
                  Thêm
                </Button>
              }
            />
          </div>
        }
        search={{
          width: 277,
          onSearch(q) {
            dispath({ type: "SET_KEYWORD", payload: q })
          },
          limitSearchLegth: 3,
        }}
        title="Danh sách bài học"
        props={{
          dataSource: lessons,
          columns: columns,
          size: "middle",
        }}
      />
    </div>
  )
}

export default Lesson
