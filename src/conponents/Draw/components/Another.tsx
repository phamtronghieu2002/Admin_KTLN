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

interface AnotherProps {
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

const Another: FC<AnotherProps> = ({
  data,
  initNumber = 4,
  onSubmit,
}) => {
  const { drawStore, dispath } = useContext<any>(context)

  const { storeCategories, dispath: dispathCategory } =
    useContext<any>(contextCategory)

  return (
    <div className="flex flex-col gap-4 wp_questionChoice">
      <div className=" bottom-1 actions fixed  w-[85%] h-11 border shadow-inner flex justify-end gap-2  right-0 z-50 bg-white items-center pr-10">
        <Button
          onClick={() => {
            onSubmit([])
            dispathCategory({ type: "SET_REFRESH" })
          }}
          className="bg-gradient-to-r p-5 from-violet-500 to-fuchsia-500 text-lime-50"
        >
          Lưu câu hỏi
        </Button>
        <Button
          onClick={() => {
            onSubmit([], true)

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

export default Another
