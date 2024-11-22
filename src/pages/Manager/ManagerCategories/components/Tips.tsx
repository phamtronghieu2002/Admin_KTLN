import { FC, useEffect, useState } from "react"
import Select from "react-select"
import TinyMCEEditor from "../../../../conponents/Markdown/Markdown"
import { Button, Tooltip } from "antd"
import ModalTips from "../../../../conponents/Modal/ModalTips"
import { IconC } from "../../../../conponents/IconC"
import { getTips, updateTip } from "../../../../services/tipServices"
import { use } from "i18next"
import { api } from "../../../../_helper"
interface TipsProps {
  category_id: string
}

const Tips: FC<TipsProps> = ({ category_id }) => {
  const [tips, setTips] = useState<any[]>([])
  const [error, setError] = useState<any>(null)
  const [selectedTip, setselectedTip] = useState<any>(null)

  const fetchTips = async () => {
    const res = await getTips(category_id)

    const data = res.data?.contents

    const options = data?.map((item: any) => ({
      ...item,
      value: item.id_tip,
      label: item.name_tip,
    }))

    setTips(options)
  }

  useEffect(() => {
    fetchTips()
  }, [])

  const validation = () => {
    const is_valid = selectedTip?.content ? true : false
    if (!is_valid) {
      setError("Tên tip không được để trống")
      return false
    }
    setError(null)
    return true
  }

  useEffect(() => {
    if (tips?.length > 0) {
      if (!selectedTip) {
        setselectedTip(tips?.[0])
        return
      } else {
        const data = tips?.find((item) => item.id_tip === selectedTip?.id_tip)
        if (!data) {
          setselectedTip(tips?.[0])
        } else {
          setselectedTip(data)
        }
      }
    }
  }, [tips])

  const handleChangeMardown = (value: string) => {
    const data = { ...selectedTip, content: value }
    setselectedTip(data)
  }

  const handleSave = async () => {
    try {
      if(!validation()) return
      await updateTip({
        cate_id: category_id,
        contents: {
          name_tip: selectedTip?.name_tip,
          id_tip: selectedTip?.id_tip,
          content: selectedTip?.content,
        },
      })
      fetchTips()
      api?.message?.success("Lưu thành công")
    } catch (e) {
      console.log("====================================")
      console.log("error", e)
      console.log("====================================")
    }
  }
  return (
    <div className="wrapper flex items-start gap-3">
      <div className="heading w-[30%] ">
        <div className="flex items-center gap-3">
          <Select
            className="flex-1"
            value={selectedTip}
            onChange={(value: any) => {
              setselectedTip(value)
            }}
            options={tips}
          />
          <ModalTips
            category_id={category_id}
            refresh={fetchTips}
            title={`Thêm tên tip`}
            button={
              <Tooltip title="Thêm tên tip">
                <Button
                  size="large"
                  type="primary"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  <IconC name={`CiCirclePlus`} size={23} />
                  Thêm
                </Button>
              </Tooltip>
            }
            type="add"
            data={{}}
          />
        </div>
        <div className="actions flex">
          <ModalTips
            category_id={category_id}
            refresh={(data: any) => {
              fetchTips()
              selectedTip?.(data)
            }}
            title={`Sửa tips`}
            button={
              <Tooltip title="Sửa tips">
                <Button
                  size="large"
                  type="link"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  <IconC name={`FaEdit`} size={23} />
                </Button>
              </Tooltip>
            }
            type="update"
            data={selectedTip}
          />
          <ModalTips
            category_id={category_id}
            refresh={() => {
              fetchTips()
              selectedTip?.(null)
            }}
            modalProps={{
              width: 550,
            }}
            title={`Xóa tips`}
            button={
              <Tooltip title="Xóa tips">
                <Button
                  size="large"
                  className="border-0 text-white p-2 !text-rose-700"
                >
                  <IconC name={`LiaTrashAlt`} size={23} />
                </Button>
              </Tooltip>
            }
            type="delete"
            data={selectedTip}
          />
        </div>
      </div>
      <div className="content">
        <TinyMCEEditor
          onChange={handleChangeMardown}
          initialValue={selectedTip?.content}
          height={450}
        />
        <div className="text-rose-500">
          {error}
        </div>
        <div className="actions flex item-center justify-end">
          <Button
            onClick={handleSave}
            className="text-yellow-50 w-56 bg-gradient-to-r from-violet-500 to-fuchsia-500 mt-2"
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Tips
