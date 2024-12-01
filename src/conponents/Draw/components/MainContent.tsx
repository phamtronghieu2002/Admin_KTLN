import { FC, useContext, useEffect, useState } from "react"
import { context } from "../provider/DrawProvider"
import { question_type_models } from "../../Modal/ModalQuestion"
import { IconC } from "../../IconC"
import TinyMCEEditor from "../../Markdown/Markdown"
import TextArea from "antd/es/input/TextArea"
import ChoiceQuestion, { optionProps } from "./ChoiceQuestion"
import { Button } from "antd"
import { _app } from "../../../utils/_app"
import { MaskLoader } from "../../Loader"
import { api } from "../../../_helper"
import { createQuestion } from "../../../services/questionServices"
import Notify from "./Notify"
import { _questionType } from "../../../utils/_constant"
import FillBlank from "./FillBlank"
import { _log } from "../../../utils/_log"
import Another from "./Another"
interface MainContentProps {
  lesson_id?: string
  type_category?: string
  className?: string
  onSubmit?: any
  data_voc?: any
}

const MainContent: FC<MainContentProps> = ({
  lesson_id,
  type_category,
  className,
  onSubmit,
  data_voc,
}) => {
  const { drawStore, dispath } = useContext<any>(context)
  const [loading, setLoading] = useState<boolean>(true)
  const question_select = drawStore?.sub_question_select
  const question_type =
    question_select?.question_type || drawStore?.question_type
  const question = drawStore?.question

  const [question_text, setQuestionText] = useState<string>("")

  const sound_voc = data_voc?.sound_voc || ""
  const [explain, setExplain] = useState<string>("")
  _log("drawStore >>>>>>>>>", drawStore)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    setQuestionText(question_text || (question_select?.question_text ?? ""))
    setExplain(question_select?.explain ?? "")
  }, [question_select])

  const question_type_item = question_type_models.find(
    (item) =>
      item.type ===
      (question_select?.question_type || drawStore?.question_type),
  )
  const getTitle = () => {
    if (drawStore?.type_action === "add") {
      return "Thêm câu hỏi mới"
    }
    return "Chỉnh sửa câu hỏi"
  }

  const handleSaveQuestion = async (
    data: optionProps,
    is_save_new: boolean = false,
  ) => {
    try {
      const question_id = question?._id
      const question_type = drawStore?.question_type
      console.log('====================================');
      console.log("question_type >>>>>", question_type);
      console.log('====================================');
      const sub_question_id = question_select
        ? question_select?.question_id
        : _app?.randomId()

      const result: any = {
        question_id,
        lesson_id,
        questions: {
          question_type,
          audio_url: sound_voc,
          description: "",
          question_id: sub_question_id,
          question_text,
          options: data,
          explain,
        },
      }
      if (data_voc) {
        result.questions.voc_id = data_voc?._id
      }
      await createQuestion(result)
      api?.message?.success("Lưu câu hỏi thành công !!!")
      dispath?.({
        type: "REFRESH",
      })

      if (is_save_new) {
        dispath?.({
          type: "SET_CONFIRM_CREATE_TYPE_QUESTION",
        })
        dispath?.({
          type: "SET_QUESTION_SELECT",
          payload: null,
        })
      } else {
        dispath?.({
          type: "SET_QUESTION_SELECT",
          payload: result?.questions,
        })
      }
      onSubmit?.()
    } catch (error) {
      console.log("====================================")
      console.log("error >>>", error)
      console.log("====================================")
    }
  }
  const HandleGetDeBai: FC<{ content: string }> = ({ content }) => {
    if (type_category != "Listening" && type_category != "Vocabulary") {
      return <TinyMCEEditor initialValue={content} disabled />
    } else if (type_category == "Listening" || type_category == "Vocabulary") {
      // trả về audio
      return (
        <audio controls src={content}>
          Your browser does not support the audio tag.
        </audio>
      )
    }

    return <></>
  }
  return (
    <div
      className={`w-[68%] border-solid border p-5 bg-slate-50 shadow-md relative ${className}`}
    >
      {question ? (
        loading ? (
          <MaskLoader />
        ) : (
          <>
            <h3 className="font-bold text-lg">{getTitle()}</h3>
            <div className="mt-3">
              {type_category == "Listening" || type_category == "Speaking" ? (
                <>
                  <p className="font-medium">Loại câu hỏi</p>
                  <div className="flex gap-3 items-center mt-3 mb-3">
                    <IconC name={question_type_item?.icon || ""} size={20} />
                    <span>{question_type_item?.title}</span>
                  </div>
                </>
              ) : (
                <></>
              )}
              <label htmlFor="">Đề bài</label>
              <div className="wp">
                <HandleGetDeBai
                  content={
                    sound_voc ||
                    question?.audio_url ||
                    question?.question_text ||
                    question?.vocURL
                  }
                />
              </div>
            </div>
            {type_category != "Speaking" && type_category != "Writing" && (
              <div className="mt-3">
                <p className="font-medium">Soạn câu hỏi</p>
                <label htmlFor="" className="mb-2 inline-block">
                  Nội dung câu hỏi
                </label>
                <TinyMCEEditor
                  initialValue={question_select?.question_text || ""}
                  onChange={setQuestionText}
                  height={200}
                  placeholder="Nhập nội dung câu hỏi"
                />
              </div>
            )}
            <div className="mt-3">
              <p className="font-medium mb-3">Câu trả lời</p>
              {type_category == "Speaking" || type_category == "Writing" ? (
                <Another
                  data={question_select?.options}
                  onSubmit={handleSaveQuestion}
                />
              ) : question_type === _questionType?.choice || !question_type  ? (
                <ChoiceQuestion
                  data={question_select?.options}
                  onSubmit={handleSaveQuestion}
                />
              ) : (
                <FillBlank
                  onSubmit={handleSaveQuestion}
                  data={question_select?.options}
                />
              )}
            </div>
            {question_type !== _questionType?.fill_in_blanks && (
              <div className="explain">
                <label htmlFor="" className="font-bol block mb-3">
                  {type_category == "Writing" || type_category == "Speaking"
                    ? "Đáp án mẫu"
                    : "Giải thích đáp án đúng"}
                </label>
                <TinyMCEEditor
                  initialValue={question_select?.explain}
                  onChange={setExplain}
                  height={200}
                  placeholder="Nhập nội dung giải thích"
                />
              </div>
            )}
          </>
        )
      ) : (
        <Notify />
      )}
    </div>
  )
}

export default MainContent
