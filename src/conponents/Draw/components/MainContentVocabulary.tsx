import { FC, useContext, useEffect, useState } from "react"
import { context } from "../provider/DrawProvider"
import { getvocByTestId } from "../../../services/vocServices"
import { MaskLoader } from "../../Loader"
import { TableC } from "../../TableC"
import { Button, Tooltip } from "antd"
import ModalVoc from "../../Modal/ModalVoc"
import { PlusOutlined } from "@ant-design/icons"
import { render } from "@testing-library/react"
import { _app } from "../../../utils/_app"
import { IconC } from "../../IconC"
import ModalQuestionVoc from "../../Modal/ModalQuestionVoc"
import Notify from "./Notify"

interface MainContentVocabularyProps {
  type_category: string
  lesson_id: string
}

const MainContentVocabulary: FC<MainContentVocabularyProps> = ({
  type_category,
  lesson_id,
}) => {
  const { drawStore, dispath } = useContext<any>(context)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState<string>("")
  const [vocs, setVocs] = useState<any>([])
  const test_id = drawStore?.test_id

  const fetchVocByTestId = async (keyword?: string) => {
    try {
      setLoading(true)
      const res = await getvocByTestId(test_id, keyword)
      const data = res?.data
      if (data) {
        setVocs(
          data?.map((item: any, index: number) => ({
            ...item,
            stt: index + 1,
          })),
        )
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log("====================================")
      console.log("error >>>", error)
      console.log("====================================")
    }
  }

  useEffect(() => {
    fetchVocByTestId(keyword)
  }, [test_id, keyword])

  const columns: any = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a: any, b: any) => a.name_lesson.length - b.name_lesson.length,
    },
    {
      title: "Từ vựng",
      dataIndex: "name_voc",
      key: "name_voc",
      sorter: (a: any, b: any) => a.name_voc.length - b.name_voc.length,
    },
    {
      title: "Loại từ",
      dataIndex: "type_voc",
      key: "type_voc",
      sorter: (a: any, b: any) => a.type_voc - b.type_voc,
    },
    {
      title: "IPA",
      dataIndex: "pronun_voc",
      key: "pronun_voc",
      sorter: (a: any, b: any) => a.total_test - b.total_test,
    },
    {
      title: "Nghĩa",
      dataIndex: "meaning_voc",
      key: "meaning_voc",
      sorter: (a: any, b: any) => a.total_test - b.total_test,
    },
    {
      title: "Hình ảnh",
      dataIndex: "img_voc",
      key: "img_voc",
      render: (value: any, record: any, index: any) => {
        return <img width={50} height={50} src={record?.img_voc} alt="" />
      },
    },
    {
      title: "Phát âm",
      dataIndex: "sound_voc",
      key: "sound_voc",
      render: (value: any, record: any, index: any) => {
        const audio = new Audio(record?.sound_voc)

        const playAudio = () => {
          audio.play()
        }

        return (
          <Button type="link" onClick={playAudio} style={{ cursor: "pointer" }}>
            <IconC name="AiOutlineSound" size={20} />
          </Button>
        )
      },
    },
    {
      title: "Giải thích",
      dataIndex: "explain_voc",
      key: "explain_voc",
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",

      render(value: any, record: any, index: any) {
        return (
          <div className="flex flex-row gap-1">
            <ModalVoc
              refresh={fetchVocByTestId}
              title={`Sửa từ vựng ${record?.name_voc}`}
              button={
                <Tooltip title="Sửa từ vựng">
                  <Button
                    type="link"
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    <IconC name={`FaEdit`} size={20} />
                  </Button>
                </Tooltip>
              }
              type="update"
              data={record}
            />
            <ModalVoc
              refresh={fetchVocByTestId}
              title={`xóa từ vựng ${record?.name_voc}`}
              button={
                <Tooltip title="Xóa từ vựng">
                  <Button className=" border-0 text-white p-2  !text-rose-700">
                    <IconC name={`LiaTrashAlt`} size={20} />
                  </Button>
                </Tooltip>
              }
              type="delete"
              data={record}
            />
            <ModalQuestionVoc
              type_category={type_category}
              lesson_id={lesson_id}
              refresh={fetchVocByTestId}
              title={`Tạo câu hỏi luyện tập từ vựng: ${record?.name_voc}`}
              button={
                <Tooltip title="Tạo câu hỏi luyện tập">
                  <Button
                    onClick={() => {
                      const questions_voc =
                        drawStore?.question?.questions?.find(
                          (item: any) => item?.voc_id === record?._id,
                        )
                      dispath({
                        type: "SET_QUESTION_SELECT",
                        payload: questions_voc,
                      })
                      dispath({
                        type: "SET_QUESTION_VOC",
                        payload: record?.sound_voc,
                      })
                    }}
                    className=" border-0 text-white p-2  !text-gray-500"
                  >
                    <IconC name={`BsQuestionSquareFill`} size={20} />
                  </Button>
                </Tooltip>
              }
              type="add"
              data={record}
            />
          </div>
        )
      },
      responsive: ["md"],
    },
  ]

  return !test_id ? (
    <div className="flex justify-center w-[60%]">
      <Notify />
    </div>
  ) : (
    <div className="flex-1 pl-3">
      {loading && <MaskLoader />}
      <TableC
        right={
          <div className="flex gap-3">
            <Button onClick={() => fetchVocByTestId()}>Làm mới</Button>
            <ModalVoc
              refresh={fetchVocByTestId}
              test_id={test_id}
              type="add"
              title="Thêm từ vựng"
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
            setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        title="Danh sách từ vựng"
        props={{
          dataSource: vocs,
          columns: columns,
          size: "middle",
        }}
      />
    </div>
  )
}

export default MainContentVocabulary
