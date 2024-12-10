import React, { useContext, useState } from "react"
import { Modal, Button, message, Tabs } from "antd" // Import các component của Ant Design
import type { TabsProps } from "antd"
import { IconC } from "../../IconC"
import { context } from "../../Draw/provider/DrawProvider"
import { optionProps } from "../../Draw/components/ChoiceQuestion"
import { _app } from "../../../utils/_app"
import { createQuestion } from "../../../services/questionServices"
import { api } from "../../../_helper"
import { MaskLoader } from "../../Loader"

// Định nghĩa kiểu cho đáp án và câu hỏi
type AnswerOption = {
  is_correct: string | boolean // Là text cho dạng điền từ, và boolean cho dạng trắc nghiệm
  option_id: string
  text: number | string // Dùng số thứ tự cho điền từ và text cho trắc nghiệm
  explain?: string | null
  index?: number
}

type Question = {
  question_text: string
  explain: string | null
  answers: AnswerOption[]
  question_type: string
}

// Component soạn thảo câu hỏi
const QuestionEditor: React.FC<{
  onQuestionsChange: (questions: Question[]) => void
}> = ({ onQuestionsChange }) => {
  const [text, setText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false) // Trạng thái cho modal hướng dẫn

  // Hiển thị modal
  const showModal = () => {
    setIsModalVisible(true)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // Xử lý thay đổi nội dung câu hỏi
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    const questions: Question[] = newText.split("\n\n").map((questionBlock) => {
      if (questionBlock.includes("[FILL]")) {
        // Dạng điền từ
        const matches = questionBlock.match(/\[FILL\]\[(.*?)\]\[(.*?)\]/g)
        const answers = matches
          ? matches.map((match, index) => {
              const answerText = match.match(/\[FILL\]\[(.*?)\]\[(.*?)\]/)
              return {
                is_correct: answerText ? answerText[1] : "",
                option_id: Math.random().toString(36).substring(7),
                text: index + 1,
                explain: answerText ? answerText[2] : null,
              }
            })
          : []
      
          const renderFillInTheBlanks = (question: Question) => {
            const { question_text, answers } = question
        
            let filledText = question_text
            
            answers.forEach((answer, index) => {
              filledText = filledText.replace(
                `[FILL][${answer.is_correct}][${answer.explain}]`,
                `(${index + 1}) ..............`,
              )
            })
        
            return filledText
          }
        
        return {
          question_type: "fill_in_blank",
          question_text: renderFillInTheBlanks(
            {
              question_text: questionBlock,
              answers,
              explain: null,
              question_type: "fill_in_blank",
            }
          ),
          explain: null,
          answers,
        }
      } else {
        // Dạng trắc nghiệm
        const lines = questionBlock.split("\n")
        const questionText = lines[0] || ""
        const explainLine = lines.find((line) => line.startsWith("+GT:")) || ""
        const explain = explainLine.replace("+GT:", "").trim()

        const answers = lines
          .slice(1)
          .filter((line) => !line.startsWith("+GT:"))
          .map((answerLine) => {
            const isCorrect = answerLine.trim().startsWith("*")
            const text = answerLine.replace(/^\*/, "").trim()
            return {
              is_correct: isCorrect,
              option_id: Math.random().toString(36).substring(7),
              text,
              explain: null,
            }
          })

        return {
          question_text: questionText,
          explain,
          answers,
          question_type: "choice",
        }
      }
    })

    onQuestionsChange(questions)
  }

  // Sao chép vào clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Đã sao chép câu hỏi mẫu!")
      })
      .catch(() => {
        message.error("Không thể sao chép câu hỏi mẫu")
      })
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Hướng dẫn Tự luận",
      children: (
        <div>
          <p>
            - Thêm <strong>[FILL]</strong> ở trước câu hỏi để hệ thống nhận
            biết.
          </p>
          <p>
            - Ô trống cần điền từ thì viết cú pháp{" "}
            <strong>[đáp án đúng 1]</strong>
          </p>
          <p>
            - Phần giải thích nằm ngay sau đáp án{" "}
            <strong>[giải thích đáp án đúng 1]</strong>
          </p>

          <div
            style={{
              backgroundColor: "#f6f6f6",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              [FILL][Generally][Explain question 1], only multitasking operating
              systems are able to support background processing. In relation to
              computers, on the screen [FILL][Background][Explain question 2]the
              color on which characters are displayed. [For example], a white
              background may be used for black characters.
            </p>
          </div>
          <Button
            onClick={() =>
              copyToClipboard(
                "[FILL][Generally][Explain question 1], only multitasking operating systems are able to support background processing. In relation to computers, on the screen [FILL][Background][Explain question 2]the color on which characters are displayed. [For example], a white background may be used for black characters.",
              )
            }
          >
            Sao chép
          </Button>
        </div>
      ),
    },
    {
      key: "2",
      label: "Hướng dẫn Trắc nghiệm",
      children: (
        <div>
          <p>
            - Dùng ký tự <strong>*</strong> trước đáp án đúng.
          </p>
          <p>
            - Thêm <strong>+GT:</strong> để viết phần giải thích nếu có.
          </p>
          <div
            style={{
              backgroundColor: "#f6f6f6",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              When we went back to the bookstore, the bookseller _ the book we
              wanted.
            </p>
            <p>A. sold</p>
            <p>*B. had sold</p>
            <p>C. sells</p>
            <p>D. sell</p>
            <p>
              +GT: The past perfect is used for an action completed before
              another past action.
            </p>
          </div>
          <Button
            onClick={() =>
              copyToClipboard(
                "When we went back to the bookstore, the bookseller _ the book we wanted.\nA. sold\n*B. had sold\nC. sells\nD. sell\n+GT: The past perfect is used for an action completed before another past action.",
              )
            }
          >
            Sao chép
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ width: "50%" }}>
      <h3>Soạn văn bản câu hỏi</h3>
      <Button
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
        type="primary"
        onClick={showModal}
        style={{ marginTop: "10px" }}
      >
        <IconC name="FaRegQuestionCircle" size={15} />
        <span> Xem Hướng dẫn</span>
      </Button>
      <textarea
        className="border border-gray-300 rounded-md p-2 mt-2 :hover:border-gray-500 outline-none"
        rows={15}
        style={{ width: "100%" }}
        value={text}
        onChange={handleTextChange}
        placeholder="Vui long soạn  câu hỏi theo cấu trúc !"
      />

      <Modal
        title="Cấu trúc soạn thảo câu hỏi bằng văn bản"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        className="!w-[1100px]"
      >
        <div className="p-5 pt-2">
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </Modal>
    </div>
  )
}

const QuestionPreview: React.FC<{
  action?: any
  questions: Question[]
  lesson_id: string
  setLoading: any
  loading: any
}> = ({ questions, lesson_id, setLoading, loading,action }) => {
  const { drawStore, dispath } = useContext<any>(context)
  const question_select = drawStore?.sub_question_select

  const question = drawStore?.question
  const renderFillInTheBlanks = (question: Question) => {
    const { question_text, answers } = question

    let filledText = question_text

 
    return filledText
  }

  const handleSaveQuestion = async (
    data: AnswerOption[],
    is_select_last_question: boolean = false,
    question_type: string,
    question_text: string,
    explain?: string,
  ) => {
    try {
      const question_id = question?._id

      const sub_question_id = _app?.randomId()

      const result: any = {
        question_id,
        lesson_id,
        questions: {
          question_type,
          description: "",
          question_id: sub_question_id,
          question_text,
          options: data,
          explain,
        },
      }
      // if (data_voc) {
      //   result.questions.voc_id = data_voc?._id
      // }
      await createQuestion(result)
      api?.message?.success("Lưu câu hỏi thành công !!!")
      dispath?.({
        type: "REFRESH",
      })

      if (is_select_last_question) {
        dispath?.({
          type: "SET_QUESTION_SELECT",
          payload: result?.questions,
        })
      }
      dispath?.({
        type: "SET_CONFIRM_CREATE_TYPE_QUESTION",
      })
      dispath?.({
        type: "SET_QUESTION_SELECT",
        payload: null,
      })
    } catch (error) {
      console.log("====================================")
      console.log(error)
      console.log("====================================")
    }
  }

  const handleConrirmSaveQuestion = async () => {
    setLoading(true)
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const data: AnswerOption[] = question.answers
      const question_type = question.question_type
      const question_text = question.question_text
      const explain: any = question.explain
      await handleSaveQuestion(
        data,
        i === questions.length - 1,
        question_type,
        question_text,
        explain,
      )
    }
    action?.closeModal()
    setLoading(false)
  }
  return (
    <div style={{ width: "50%", paddingLeft: "20px" }}>
      <div className="border h-80 p-5 mb-5 overflow-scroll">
        <h3 className="font-bold text-xl mb-5">Preview Câu Hỏi</h3>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>
              <strong>Câu hỏi {index + 1}:</strong>{" "}
              {question.answers.some((a) => typeof a.is_correct === "string")
                ? renderFillInTheBlanks(question)
                : question.question_text}
            </p>
            <ul>
              {question.answers.map((answer, idx) => (
                <li
                  key={answer.option_id}
                  style={{
                    color:
                      typeof answer.is_correct === "string"
                        ? "black"
                        : answer.is_correct
                        ? "green"
                        : "black",
                  }}
                >
                  {typeof answer.text === "string" ? (
                    <>
                      {answer.text} -{" "}
                      <span style={{ color: "green" }}>
                        {answer.is_correct}
                      </span>
                      {answer.explain && ` - Giải thích: ${answer.explain}`}
                    </>
                  ) : (
                    <>
                      Điền từ {answer.text} - Giải thích: {answer.explain}
                    </>
                  )}
                </li>
              ))}
            </ul>
            {question.explain && (
              <p>
                <strong>Giải thích:</strong> {question.explain}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="actions">
        <Button
          onClick={handleConrirmSaveQuestion}
          className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          type="primary"
        >
          <IconC name="CiSquarePlus" size={20} />
          Xác nhận thêm câu hỏi
        </Button>
      </div>
    </div>
  )
}

const QuestionManager: React.FC<{
  action?: any
  lesson_id: string
}> = ({ lesson_id,action }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {loading && <MaskLoader />}
      <QuestionEditor onQuestionsChange={setQuestions} />
      <QuestionPreview
        action={action}
        setLoading={setLoading}
        loading={loading}
        lesson_id={lesson_id}
        questions={questions}
      />
    </div>
  )
}

export default QuestionManager
