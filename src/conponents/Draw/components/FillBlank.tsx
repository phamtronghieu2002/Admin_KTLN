import { Button, Input, Radio, Tooltip } from "antd"
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
import { _log } from "../../../utils/_log"
import { list } from "postcss"

interface BlankQuestionProps {
  data?: any
  initNumber?: number
  onSubmit?: any
}

export interface optionProps {
  is_correct: string
  option_id: string
  text: string
  index?: number
  explain?: string
}

interface BlankItemProps {
  data?: optionProps
  option_id?: string
  onChange?: any
  onDelete?: () => void

  index: number
}

const BlankItem: FC<BlankItemProps> = ({
  index,
  data,
  onChange,
  onDelete,

  option_id,
}) => {
  _log("data trong item nha mấy ní !!", data)
  return (
    <div>
      <div className="heading flex justify-between mb-2">
        {/* <div>
          <label htmlFor="">{`Đáp án thứ ${index}`}</label>
        </div> */}
        <div className="form flex gap-3 items-center flex-1">
          ({" "}
          <Input
            defaultValue={data?.text}
            name="text"
            onChange={(e) =>
              onChange?.(e.target.name, e.target.value, option_id)
            }
            className="w-[10%]"
            type="text"
            placeholder="Số"
          />{" "}
          )
          <Input
            defaultValue={data?.is_correct}
            name="is_correct"
            onChange={(e) =>
              onChange?.(e.target.name, e.target.value, option_id)
            }
            className="w-[70%]"
            type="text"
            placeholder="Nhập đáp án"
          />
          <Input
            defaultValue={data?.explain}
            name="explain"
            onChange={(e) =>
              onChange?.(e.target.name, e.target.value, option_id)
            }
            className="flex-1!"
            type="text"
            placeholder="Nhập giải thích"
          />
          <Button onClick={() => onDelete?.()} className="text-rose-400">
            <Tooltip title="Xóa đáp án" color="red">
              <IconC name="FaTrash" size={14} />
            </Tooltip>
          </Button>
        </div>
      </div>
      <div className="content"></div>
    </div>
  )
}

const FillBlank: FC<BlankQuestionProps> = ({
  data,
  initNumber = 1,
  onSubmit,
}) => {
  const { drawStore, dispath } = useContext<any>(context)
  const initQuestionBlank = useMemo(() => {
    return Array.from({ length: initNumber }, (_, index) => {
      return {
        is_correct: "",
        option_id: Math.random().toString(36).substring(7),
        text: "",
        explain: "",
      }
    })
  }, [drawStore?.confirm_create_type_question])

  const [listBlank, setListBlank] = useState<optionProps[]>(initQuestionBlank)

  const { dispath: dispathCategory } = useContext<any>(contextCategory)

  const handleSetData = (name: string, value: string, option_id: string) => {
    const new_Blanks = listBlank.map((Blank: any) => {
      if (Blank.option_id === option_id) {
        Blank[name] = value
      }
      return Blank
    })
    setListBlank(new_Blanks)
  }

  useEffect(() => {
    if (data) {
      setListBlank(data)
    } else {
      setListBlank(initQuestionBlank)
    }
  }, [data, drawStore?.confirm_create_type_question])

  const handleDelete = (item: optionProps) => {
    const newList = listBlank.filter(
      (Blank: optionProps) => Blank.option_id !== item.option_id,
    )
    setListBlank(newList)
  }

  const handleAddNewBlank = () => {
    const newBlank = {
      is_correct: "",
      option_id: Math.random().toString(36).substring(7),
      text: "",
      explain: "",
    }
    setListBlank([...listBlank, newBlank])
  }
  return (
    <div className="flex flex-col gap-4 wp_questionBlank">
      {listBlank?.map((item: optionProps, index: number) => {
        return (
          <BlankItem
            key={item.option_id}
            index={index + 1}
            data={item}
            option_id={item.option_id}
            onChange={handleSetData}
            onDelete={() => handleDelete(item)}
          />
        )
      })}

      <Button
        onClick={handleAddNewBlank}
        className="w-[20%] bg-gradient-to-r from-purple-500 to-pink-500 text-yellow-50"
      >
        Thêm Đáp án
      </Button>
      <div className=" bottom-1 actions fixed  w-[85%] h-11 border shadow-inner flex justify-end gap-2  right-0 z-50 bg-white items-center pr-10">
        <Button
          onClick={() => {
            onSubmit(listBlank)
            dispathCategory({ type: "SET_REFRESH" })
          }}
          className="bg-gradient-to-r p-5 from-violet-500 to-fuchsia-500 text-lime-50"
        >
          Lưu câu hỏi
        </Button>
        <Button
          onClick={() => {
            onSubmit(listBlank, true)
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

export default FillBlank
