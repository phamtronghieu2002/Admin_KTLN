import { FC, useRef } from "react"
import { Button } from "antd"
import TinyMCEEditor from "../../../conponents/Markdown/Markdown"

interface TermProps {}

const Term: FC<TermProps> = () => {
  const editorRef = useRef<any>(null) // Store the editor instance

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent()
      //call api save policy
    }
  }

  return (
    <div>
      <h1 className="text-lg mb-4">Điều khoản của App</h1>
      <div className="actions mb-4 flex justify-end">
        <Button type="primary" onClick={handleSave}>
          Lưu
        </Button>
      </div>
      <div className="content">
        <TinyMCEEditor ref={editorRef} initialValue="<p>xin chao 123</p>" />
      </div>
    </div>
  )
}

export default Term
