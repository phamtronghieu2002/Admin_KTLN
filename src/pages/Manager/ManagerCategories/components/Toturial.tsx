import { FC, useEffect, useState } from "react"
import TinyMCEEditor from "../../../../conponents/Markdown/Markdown"
import { Button } from "antd"
import { addToturial, getTotural } from "../../../../services/toturialServices"
import { api } from "../../../../_helper"

interface ToturialsProps {
  category_id: string
}

const Toturials: FC<ToturialsProps> = ({ category_id }) => {
  const [contents, setContents] = useState<string>("")

  const fetchToturial = async () => {
    try {
      const res = await getTotural(category_id)
      const data = res.data?.contents ?? ""
      setContents(data)
    } catch (error) {
      console.log("====================================")
      console.log("error", error)
      console.log("====================================")
    }
  }

  useEffect(() => {
    fetchToturial()
  }, [])

  const handleSave = async () => {
    try {
      await addToturial({
        cate_id: category_id,
        contents,
      })
      api?.message?.success("Thêm hướng dẫn thành công !!!")
    } catch (error) {
      api?.message?.error("Thêm hướng dẫn thất bại !!!")

      console.log("error", error)
    }
  }
  return (
    <div>
      <TinyMCEEditor
        initialValue={contents}
        onChange={(content, option_id, gapCount, gapNumbers) => {
          setContents(content)
          console.log("Nội dung:", content)
          console.log("Số lượng lỗ trống:", gapCount)
          console.log("Mảng số thứ tự:", gapNumbers) // Mảng số thứ tự, ví dụ: [1, 2]
        }}
      />
      <div className="actions mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          className="w-56 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-indigo-50"
        >
          Lưu
        </Button>
      </div>
    </div>
  )
}

export default Toturials
