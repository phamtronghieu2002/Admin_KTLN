import { ReactNode, memo, useEffect, useState } from "react"
import { getIntegratedStatisticsService } from "../../../../services/manage_statisticsServices"
import { NavLink } from "react-router-dom"
import { routeConfig } from "../../../../configs/routeConfig"
import {
  PiUserCirclePlusDuotone,
  PiUserListFill,
  PiUserPlusDuotone,
  PiUserPlusFill,
} from "react-icons/pi"
import {
  CirButtonC,
  CircleButton,
  CircleButtonText,
} from "../../../../conponents/ButtonC"
import { CustomerAddModal } from "../../../../conponents/modals/CustomerAddModal"
import { BsFillBoxSeamFill } from "react-icons/bs"
import { IIntegratedStatistics } from "../../../../_types/userType"
import { Divider, Spin } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import { AiOutlineSync } from "react-icons/ai"

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

const CardSSmall: React.FC<ICardS> = ({ item }) => {
  return (
    <div
      className="px-4 py-2 flex flex-col min-w-[280px] h-[150px] relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/bg_section_wave.png')",
        backgroundPosition: `0 100%, right 15px bottom 15px`,
        backgroundSize: `100%, 55px`,
        backgroundRepeat: "no-repeat",
        // backgroundColor: item?.bgColor,
      }}
    >
      <div className="h-[120px] w-[120px] text-theme bg-[#00000012] rounded-full flex items-center justify-center absolute opacity-20 -right-[30px] -top-[30px] pointer-events-none">
        {item?.iconBg}
      </div>
      <div className="h-[70px] flex flex-col justify-between text-[11px]">
        <div className="text">{item?.title}</div>
        <div className="flex">{item?.midContent}</div>
      </div>
      <div className="flex-1 flex items-center overflow-hidden">
        {item?.bottomContent}
      </div>
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

export const IntegratedStatisticsSmall: React.FC<IProps> = memo(
  ({ userId, size = "default" }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<IIntegratedStatistics>()

    const getData = () => {
      setIsLoading(true)
      const getIntegratedStatisticsPromise =
        getIntegratedStatisticsService(userId)

      Promise.all([getIntegratedStatisticsPromise])
        .then(([integratedStatisticsFb]) => {
          setData(integratedStatisticsFb?.data)
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false)
        })
    }

    useEffect(() => {
      getData()
    }, [userId])

    const dataRender: ICardSItem[] = [
      {
        title: "Tổng thiết bị",
        iconBg: <BsFillBoxSeamFill size={30} />,
        bgColor: "var(--blue-bea-2)",
        onReload: getData,
        midContent: (
          <div>
            <NavLink
              className={"hover:text-root_text_color"}
              to={`${routeConfig?.manager_u_device}`}
            >
              <div className="items-end gap-6 flex text-3xl">
                <div className="border-b-white hover:text-prim hover:border-b-prim">
                  {/* <span className="text-[12px] font-light">Tổng</span>{" "} */}
                  {isLoading ? <Spin /> : data?.total_device ?? "-"}{" "}
                  <span className="text-[12px] font-light">Thiết bị</span>
                </div>
              </div>
            </NavLink>
          </div>
        ),
        bottomContent: (
          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-center">
              <div>
                <NavLink
                  className={"hover:text-prim flex items-center gap-1"}
                  to={`${routeConfig?.manager_u_business}?tab=device&user_id=${userId}`}
                >
                  <div className="font-semibold">
                    {data?.total_device_actived ?? "-"}
                  </div>
                  <div className="font-light text-[11px]">Kích hoạt</div>
                </NavLink>
              </div>
              <Divider className="my-[2px]" />
              <div>
                <NavLink
                  className={"hover:text-prim flex items-center gap-1"}
                  to={`${routeConfig?.manager_u_device}`}
                >
                  <div className="font-semibold ">
                    {(data?.total_device || 0) -
                      (data?.total_device_actived || 0) ?? "-"}
                  </div>
                  <div className="font-light text-[11px]">Chưa kích hoạt</div>
                </NavLink>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div>
                <NavLink
                  className={"hover:text-prim flex items-center gap-1"}
                  to={`${routeConfig?.manager_u_business}?tab=device&user_id=${userId}`}
                >
                  <div className="font-semibold">
                    {data?.warehouse_not_actived ?? "-"}
                  </div>
                  <div className="font-light text-[11px]">Tồn kho</div>
                </NavLink>
              </div>
              <Divider className="my-[2px]" />
              <div>
                <NavLink
                  className={"hover:text-prim flex items-center gap-1"}
                  to={`${routeConfig?.manager_u_device}`}
                >
                  <div className="font-semibold ">
                    {(data?.total_device || 0) -
                      (data?.warehouse_not_actived || 0) ?? "-"}
                  </div>
                  <div className="font-light text-[11px]">Xuất kho</div>
                </NavLink>
              </div>
            </div>
          </div>
        ),
      },

      {
        title: "Nhà bán hàng và khách hàng",
        iconBg: <PiUserListFill size={30} />,
        bgColor: "var(--blue-bea-1)",
        onReload: getData,
        midContent: (
          <div>
            <NavLink
              className={"hover:text-root_text_color"}
              to={`${routeConfig?.manager_u_business}?tab=users&user_id=${userId}`}
            >
              <div className="items-end gap-4 flex text-3xl">
                <div className="border-b-white hover:text-prim hover:border-b-prim">
                  {isLoading ? <Spin /> : data?.agency ?? "-"}{" "}
                  <span className="text-[12px] font-light">Đại lý</span>
                </div>
                <span className="text-[18px] font-thin">&</span>
                <div className="border-b-white hover:text-prim hover:border-b-prim">
                  <span className="text-3xl">
                    {isLoading ? <Spin /> : `${data?.customers ?? "-"}`}
                  </span>{" "}
                  <span className="text-[12px] font-light">Khách hàng</span>
                </div>
              </div>
            </NavLink>
          </div>
        ),
        bottomContent: (
          <div className="h-full flex items-end">
            <CustomerAddModal
              userId={userId}
              button={
                <CircleButtonText
                  size={44}
                  icon={<PiUserPlusDuotone size={16} />}
                  text="+Thêm"
                />
              }
            />
          </div>
        ),
      },
    ]

    return (
      <div className="">
        <div className="flex gap-4">
          {dataRender?.map?.((item, index) => {
            return <CardSSmall item={item} key={index} />
          })}
        </div>
      </div>
    )
  },
)
