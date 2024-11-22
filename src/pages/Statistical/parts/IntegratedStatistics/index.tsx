import { ReactNode, memo, useEffect, useState } from "react"
// import { getIntegratedStatisticsService } from "../../../../services/manage_statisticsServices"
import { NavLink } from "react-router-dom"
import { routeConfig } from "../../../../configs/routeConfig"
import {
  PiUserCirclePlusDuotone,
  PiUserListFill,
  PiUserPlusFill,
} from "react-icons/pi"
import {
  CirButtonC,
  CircleButton,
  CircleButtonText,
} from "../../../../conponents/ButtonC"

import { BsFillBoxSeamFill } from "react-icons/bs"
import { IIntegratedStatistics } from "../../../../_types/userType"
import { Spin } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import { AiOutlineSync } from "react-icons/ai"
import { getStatistic } from "../../../../services/statisticService"

interface IProps {
  userId: number
  size?: string
}

interface ICardSItem {
  iconBg: ReactNode
  title: ReactNode
  midContent: ReactNode
  bottomContent: ReactNode
  bgColor: string
  onReload?: () => void
}

interface ICardS {
  item: ICardSItem
}

const CardS: React.FC<ICardS> = ({ item }) => {
  return (
    <div
      className="bg-blueBea1 px-4 py-4 text-white flex flex-col min-w-[350px] h-[180px] relative"
      style={{
        backgroundImage: "url('/assets/images/bg_section_wave.png')",
        backgroundPosition: `0 100%, right 15px bottom 15px`,
        backgroundSize: `100%, 55px`,
        backgroundRepeat: "no-repeat",
        backgroundColor: item?.bgColor,
      }}
    >
      <div className="h-[150px] w-[150px] bg-[#fafafa3b] rounded-full  flex-wrap flex items-center justify-center absolute opacity-40 -right-[30px] -top-[30px] pointer-events-none">
        {item?.iconBg}
      </div>
      <div className="h-[90px] flex flex-col justify-between">
        <div className="text">{`${item?.title}`?.toLocaleUpperCase?.()}</div>
        <div className="flex items-center justify-center flex-wrap">
          {item?.midContent}
        </div>
      </div>
      <div className="flex-1">{item?.bottomContent}</div>
      <div className="absolute top-0 right-0">
        <CircleButton
          onClick={item?.onReload}
          size={30}
          icon={<AiOutlineSync />}
        ></CircleButton>
      </div>
    </div>
  )
}

export const IntegratedStatistics: React.FC<IProps> = memo(
  ({ userId, size = "default" }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<any>()

    const getData = async () => {
      setIsLoading(true)
      const res: any = await getStatistic()
      setData(res)
      setIsLoading(false)
    }

    useEffect(() => {
      getData()
    }, [userId])

    const dataRender: ICardSItem[] = [
      {
        title: "Người dùng",
        iconBg: <PiUserListFill size={40} />,
        bgColor: "var(--blue-bea-1)",
        onReload: getData,
        midContent: (
          <div>
            <NavLink
              className={"hover:text-white"}
              to={`${"123"}?tab=users&user_id=${userId}`}
            >
              <div className="items-end gap-4 flex text-4xl">
                <div className="font-semibold border-b-white hover:text-prim hover:border-b-prim">
                  {isLoading ? <Spin /> : data?.users}{" "}
                  <span className="text-[12px] font-light">Người dùng</span>
                </div>
                <span className="text-[18px] font-thin">&</span>
                <div className="font-semibold border-b-white hover:text-prim hover:border-b-prim">
                  <span className="text-2xl">
                    {isLoading ? <Spin /> : `${data?.usersCurrentMonth}`}
                  </span>{" "}
                  <span className="text-[12px] font-light">
                    Người dùng mới trong tháng
                  </span>
                </div>
              </div>
            </NavLink>
          </div>
        ),
        bottomContent: (
          <div className="h-full flex items-end">
            {/* <CustomerAddModal
              userId={userId}
              button={
                <CircleButtonText
                  icon={<PiUserPlusFill size={18} />}
                  text="+Thêm"
                />
              }
            /> */}
          </div>
        ),
      },

      {
        title: "Tổng bài học",
        iconBg: <BsFillBoxSeamFill size={40} />,
        bgColor: "var(--blue-bea-2)",
        onReload: getData,
        midContent: (
          <div>
            <NavLink className={"hover:text-white"} to={``}>
              <div className="items-end gap-4 flex text-4xl">
                <div className="font-semibold border-b-white hover:text-prim hover:border-b-prim">
                  <span className="text-[12px] font-light">Tổng</span>{" "}
                  {isLoading ? <Spin /> : data?.lesson}{" "}
                  <span className="text-[12px] font-light">Bài học</span>
                </div>
              </div>
            </NavLink>
          </div>
        ),

        bottomContent: <></>,
      },
    ]

    return (
      <div className="">
        <div className="flex gap-4">
          {dataRender?.map?.((item, index) => {
            return <CardS item={item} key={index} />
          })}
        </div>
      </div>
    )
  },
)
