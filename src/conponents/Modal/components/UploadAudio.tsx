import { FC, useEffect, useState } from "react"
import { Upload, Button, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import axios from "..//..//..//services/axiosInstance"
import { _app } from "../../../utils/_app"
import { MaskLoader } from "../../Loader"
import { log } from "console"

interface UploadAudioProps {
  setUrl: (url: string) => void
  initialUrl?: string
}

const UploadAudio: FC<UploadAudioProps> = ({ setUrl, initialUrl }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(
    initialUrl ? initialUrl : null,
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [keyRefresh, setKeyRefresh] = useState<number>(0)
  const beforeUpload = (file: File) => {
    const isAudio = file.type.startsWith("audio/")
    if (!isAudio) {
      message.error("You can only upload audio files!")
      return false
    }

    // Preview the audio file
    const audioURL = URL.createObjectURL(file)

    setAudioUrl(audioURL)
    setAudioFile(file)
    setKeyRefresh(Math.random())
    
    return false // Prevent automatic upload by Ant Design
  }

  useEffect(() => {
    if (audioUrl) {
      handleUpload()
    }
  }, [audioUrl])

  const handleUpload = async () => {
    if (initialUrl && !keyRefresh) return
    if (!audioFile) {
      message.error("No audio file selected!")
      return
    }

    const formData = new FormData()
    formData.append("audio", audioFile)

    try {
      setLoading(true)
      const response: any = await axios.post("/audio/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setLoading(false)

      setUrl(response?.url)

      message.success("Upload successful!")
    } catch (error) {
      message.error("Upload failed!")
    }
  }

  return (
    <div>
      <Upload beforeUpload={beforeUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Select Audio</Button>
      </Upload>

      {audioUrl && (
        <div>
          <p>Audio Preview:</p>
          <audio controls src={audioUrl}>
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
      {loading && <MaskLoader />}
    </div>
  )
}

export default UploadAudio
