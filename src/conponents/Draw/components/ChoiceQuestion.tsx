import { Button, Radio } from "antd"
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { IconC } from "../../IconC"
import TinyMCEEditor from "../../Markdown/Markdown"
import { s } from "vitest/dist/types-e3c9754d.js"
import { context } from "../provider/DrawProvider"
import { context as contextCategory } from "..//..//..//pages//Manager//ManagerCategories//Provider//ManagerCategoryProvider"

interface ChoiceQuestionProps {
  data?: any
  initNumber?: number
  onSubmit: any
}

export interface optionProps {
  is_correct: boolean
  option_id: string
  text: string
  index?: number
}

interface ChoiceItemProps {
  data?: optionProps
  option_id?: string
  onChange?: () => void
  onDelete?: () => void
  onChangeMarkdown: any
  index: number
}

const ChoiceItem: FC<ChoiceItemProps> = ({
  index,
  data,
  onChange,
  onDelete,
  onChangeMarkdown,
  option_id,
}) => {
  return (
    <div>
      <div className="heading flex justify-between mb-2">
        <div>
          <Radio
            onChange={() => onChange?.()}
            className="mr-3"
            checked={data?.is_correct}
          />
          <label htmlFor="">{`Đáp án thứ ${index}`}</label>
        </div>
        <Button onClick={() => onDelete?.()} className="text-rose-400">
          Xóa đáp án <IconC name="FaTrash" size={14} />
        </Button>
      </div>
      <div className="content">
        <TinyMCEEditor
          initialValue={data?.text}
          option_id={option_id}
          onChange={onChangeMarkdown}
          height={200}
          placeholder="Nhập nội dung đáp án"
        />
      </div>
    </div>
  )
}

const ChoiceQuestion: FC<ChoiceQuestionProps> = ({
  data,
  initNumber = 4,
  onSubmit,
}) => {
  console.log('====================================');
  console.log("data >>>>>", data);
  console.log('====================================');
  const { drawStore, dispath } = useContext<any>(context)
  const initQuestionChoice = useMemo(() => {
    return Array.from({ length: initNumber }, (_, index) => {
      return {
        is_correct: index == 0,
        option_id: Math.random().toString(36).substring(7),
        text: "",
      }
    })
  }, [drawStore?.confirm_create_type_question])

  const [listChoice, setListChoice] =
    useState<optionProps[]>(initQuestionChoice)

  const { storeCategories, dispath: dispathCategory } =
    useContext<any>(contextCategory)


  useEffect(() => {
    if (data) {
      setListChoice(data)
    } else {
      setListChoice(initQuestionChoice)
    }
  }, [data, drawStore?.confirm_create_type_question])

  const handleCheck = (item: optionProps) => {
    const newList = listChoice.map((choice: optionProps) => {
      return {
        ...choice,
        is_correct: choice.option_id === item.option_id,
      }
    })
    setListChoice(newList)
  }

  const handleDelete = (item: optionProps) => {
    const newList = listChoice.filter(
      (choice: optionProps) => choice.option_id !== item.option_id,
    )
    setListChoice(newList)
  }

  const handleChangedMarkdown = (content: string, option_id: string) => {
    const new_choices = listChoice.map((choice: optionProps) => {
      if (choice.option_id === option_id) {
        choice.text = content
      }
      return choice
    })

    setListChoice(new_choices)
  }
  const handleAddNewChoice = () => {
    const newChoice = {
      is_correct: false,
      option_id: Math.random().toString(36).substring(7),
      text: "",
      index: listChoice.length + 1,
    }
    setListChoice([...listChoice, newChoice])
  }
  return (
    <div className="flex flex-col gap-4 wp_questionChoice">
      {listChoice?.map((item, index) => {
        return (
          <ChoiceItem
            index={index + 1}
            option_id={item.option_id}
            onChangeMarkdown={handleChangedMarkdown}
            onDelete={() => handleDelete(item)}
            onChange={() => handleCheck(item)}
            key={index}
            data={item}
          />
        )
      })}
      <Button
        onClick={handleAddNewChoice}
        className="w-[20%] bg-gradient-to-r from-purple-500 to-pink-500 text-yellow-50"
      >
        Thêm Đáp án
      </Button>
      <div className=" bottom-1 actions fixed  w-[85%] h-11 border shadow-inner flex justify-end gap-2  right-0 z-50 bg-white items-center pr-10">
        <Button
          onClick={() => {
            onSubmit(listChoice)
            dispathCategory({ type: "SET_REFRESH" })
          }}
          className="bg-gradient-to-r p-5 from-violet-500 to-fuchsia-500 text-lime-50"
        >
          Lưu câu hỏi
        </Button>
        <Button
          onClick={() => {
            onSubmit(listChoice, true)
       
            dispath({
              type: "SET_TYPE_ACTION",
              payload: "add",
            })
            
            dispathCategory({ type: "SET_REFRESH" })
          }}
          className="bg-gradient-to-r p-5 from-sky-500 to-fuchsia-500 text-lime-50"
        >
          Lưu và tạo mới
        </Button>
      </div>
    </div>
  )
}

export default ChoiceQuestion
