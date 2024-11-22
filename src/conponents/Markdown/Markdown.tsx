import { forwardRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import Overlay from "../Overlay/Overlay"

interface TinyMCEEditorProps {
  placeholder?: string
  option_id?: string
  initialValue?: string
  height?: number
  disabled?: boolean
  onChange?: (
    content: string,
    option_id?: string,
    gapCount?: number,
    gapNumbers?: number[],
  ) => void
}

const TinyMCEEditor = forwardRef<any, TinyMCEEditorProps>(
  (
    { initialValue, height = 300, onChange, disabled, option_id, placeholder },
    ref,
  ) => {
    const [gapCount, setGapCount] = useState(0)
    const [gapNumbers, setGapNumbers] = useState<number[]>([])

    const handleEditorChange = (content: string) => {
      const regex = /\((\d+)\)___/g
      const matches = Array.from(content.matchAll(regex))
      const numbers = matches.map((match) => parseInt(match[1]))

      setGapCount(matches.length)
      setGapNumbers(numbers)

      onChange?.(content, option_id || "", matches.length, numbers)
    }

    return (
      <div className="editor_wrapper relative">
        {disabled && <Overlay />}
        <Editor
          disabled={disabled}
          onChange={(e) => handleEditorChange(e.target.getContent())}
          tinymceScriptSrc={"/tinymce/tinymce.min.js"}
          onInit={(_evt, editor) => {
            if (ref) {
              ;(ref as any).current = editor
            }
          }}
          init={{
            licenseKey: "gpl",
            placeholder,
            height,
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
            toolbar:
              "undo redo | customGapButton | bold italic underline strikethrough | link image media table | numlist bullist",
            setup: (editor) => {
              let gapIndex = 1

              // Thêm nút tùy chỉnh để chèn lỗ trống với id tùy chỉnh
              editor.ui.registry.addButton("customGapButton", {
                text: "Thêm lỗ trống",
                onAction: () => {
                  const range = editor.selection.getRng() // Lấy vị trí hiện tại của con trỏ dưới dạng range
                  const span = document.createElement("span")
                  span.innerHTML = `(${gapIndex})___`
                  gapIndex++
                  range.insertNode(span)
                  editor.selection.setCursorLocation(span, 1)
                },
              })
            },
          }}
          initialValue={initialValue || ""}
        />
      </div>
    )
  },
)

export default TinyMCEEditor
