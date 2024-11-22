import { ConfigProvider } from "antd"
import Sider from "antd/es/layout/Sider"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"
import { Logo } from "../../../conponents/Logo"
import { MenuHead } from "./MenuHead"
import { UserHead } from "./UserHead"
import { memo, useState } from "react"

export const LayoutSideBar: React.FC = memo(() => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            motion: false,
          },
        },
      }}
    >
      <Sider
        collapsedWidth={70}
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={
          <div className="h-full flex justify-center items-center text-lg hover:text-prim">
            {collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          </div>
        }
      >
        <div className="h-full flex flex-col gap-2  __menu_head">
          <div className="h-14 flex">
            <div className="flex h-14 w-[70px] justify-center items-center">
              <Logo
                style={{
                  width: "100%",
                  height:"50px",
           
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <MenuHead />
          </div>
          <div className="__no_title">
            <UserHead />
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  )
})
