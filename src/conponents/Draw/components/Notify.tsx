import { FC } from "react"
import { IconC } from "../../IconC"

interface NotifyProps {}

const Notify: FC<NotifyProps> = () => {
  return (
    <div className="h-full flex items-center justify-center text-2xl">
      Vui lòng tạo bài Test trước khi thêm câu hỏi !
      <img
        width={50}
        height={50}
        src="https://res.cloudinary.com/dzpj1y0ww/image/upload/v1729090025/ielts/happy_nzgtvp.gif"
      />
    </div>
  )
}

export default Notify
