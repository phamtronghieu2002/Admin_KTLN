import { MenuProps } from "rc-menu"
import { ReactNode, lazy } from "react"
import { NavLink } from "react-router-dom"
import { TFunction } from "i18next"
import {
  PiChartPieLight,
  PiLockKeyDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi"

import { store } from "../app/store"
import { IconC } from "../conponents/IconC"
import { IServerMenu } from "../_types/interfaceType"
import { FcBusinessman } from "react-icons/fc"
import { FaPowerOff } from "react-icons/fa"
import { RiMessage3Fill } from "react-icons/ri"
import { IoSettingsSharp } from "react-icons/io5"
import { LiaPowerOffSolid } from "react-icons/lia"
import { TreeDataNode } from "antd"
import { api } from "../_helper"
import { _app } from "../utils/_app"
import { routeConfig } from "../configs/routeConfig"
import { randomUUID } from "crypto"
import { FaMicrophone } from "react-icons/fa6"
import Introduction from "../pages/Manager/Introduction"

export const fakeMenu: IServerMenu[] = [
  {
    child: [],
    icon: "FaHome",
    id: 999,
    link: routeConfig.manager,
    lv: 0,
    name: "Trang chủ",
    parent_id: 0,
    type: "nuldl",
    component: "",
  },
  {
    child: [
      {
        child: [],
        icon: "FaHeadphones",
        id: 1,
        link: routeConfig.manager_listening,
        lv: 0,
        name: "Nghe",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },
      {
        child: [],
        icon: "FaMicrophone",
        id: 2,
        link: routeConfig.manager_speaking,
        lv: 0,
        name: "Nói",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },
      {
        child: [],
        icon: "FaAddressBook",
        id: 3,
        link: routeConfig.manager_reading,
        lv: 0,
        name: "Đọc",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },

      {
        child: [],
        icon: "FaPen",
        id: 4,
        link: routeConfig.manager_writing,
        lv: 0,
        name: "Viết",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },
      {
        child: [],
        icon: "SiFacebookgaming",
        id: 5,
        link: routeConfig.manager_grammar,
        lv: 0,
        name: "Ngữ pháp",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },
      {
        child: [],
        icon: "MdOutlineTextIncrease",
        id: 999,
        link: routeConfig.manager_vocabulary,
        lv: 0,
        name: "Từ vựng",
        parent_id: 0,
        type: "nuldl",
        component: "",
      },
    ],
    icon: "BiCategory",
    id: 6,
    link: routeConfig.monitor,
    lv: 0,
    name: "Danh mục",
    parent_id: 0,
    type: "nuldl",
    component: "",
  },
  {
    child: [],
    icon: "FiSmartphone",
    id: 25,
    link: routeConfig.manager_policy,
    lv: 0,
    name: "App",
    parent_id: 0,
    type: "nuldl",
    component: "",
  },
  {
    child: [],
    icon: "PiExamFill",
    id: 9,
    link: routeConfig.manager_exam,
    lv: 0,
    name: "Đề thi",
    parent_id: 0,
    type: "nuldl",
    component: "",
  },
]
export const NLink: React.FC<{
  to: string
  label: ReactNode
}> = ({ to, label }) => {
  return (
    <NavLink to={to} className={({ isActive }) => `${isActive ? "" : ""}`}>
      {label}
    </NavLink>
  )
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  disabled?: boolean,
  children?: MenuItem[],
  onClick?: () => void,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
    disabled: disabled || false,
  } as MenuItem
}
type MenuItem = Required<MenuProps>["items"][number]

export interface IHEADER {
  path: string
  title: string
  icons: ReactNode
  key: string
  type?: string
  children?: IHEADER[]
  disabled?: boolean
  onClick?: () => void
}

export const HEADER = (): IHEADER[] => {
  // const serverMenu = store?.getState?.()?.interface?.menu
  const serverMenu = fakeMenu

  const getMenu = (menu: IServerMenu): IHEADER => {
    const Icon = <IconC name={menu?.icon} />

    return {
      path: menu?.link,
      title: menu?.name,
      type: menu?.type,
      icons: Icon,
      key: `${menu?.link}`,
      children: menu?.child?.length
        ? menu?.child?.map?.((m) => getMenu(m))
        : undefined,
    }
  }

  return serverMenu?.map?.((menu, index) => {
    return getMenu(menu)
  })
}

export const HEADER_ITEMS = (
  t: TFunction<"translation", undefined>,
  customHeader?: IHEADER[],
  useIcon = true,
): MenuItem[] => {
  return (customHeader || HEADER())?.map?.((header, index) => {
    const getHeader = (header: IHEADER): MenuItem => {
      const title =
        header?.type == "title" ? (
          t(header.title)
        ) : (
          <NLink to={header.path} label={t(header.title)} />
        )
      const icon = useIcon ? header?.icons : null
      return getItem(
        title,
        header?.key,
        icon,
        header?.disabled,
        header?.children?.map?.((child) => getHeader(child)),
      )
    }

    return getHeader(header)
  })
}

///USERHEADER
export const USER_HEADER_ITEMS = (
  t: TFunction<"translation", undefined>,
  customHeader?: IHEADER[],
  useIcon = true,
): MenuItem[] => {
  return USER_HEADER()?.map?.((header, index) => {
    const getHeader = (header: IHEADER): MenuItem => {
      const title =
        header?.type == "title" ? (
          t(header.title)
        ) : (
          <NLink to={header.path} label={t(header.title)} />
        )
      const icon = useIcon ? header?.icons : null
      return getItem(
        title,
        header?.key,
        icon,
        header?.disabled,
        header?.children?.map?.((child) => getHeader(child)),
        header?.onClick,
      )
    }

    return getHeader(header)
  })
}

export const USER_HEADER = (): IHEADER[] => {
  const userInfo = store?.getState?.()?.user?.access?.userInfo
  return [
    {
      path: routeConfig?.monitor,
      title:  "Admin",
      icons: (
        <div className="bg-white rounded-full">
          <FcBusinessman />
        </div>
      ),
      type: "title",
      key: "1",
      children: [
        // {
        //   path: routeConfig?.report_synthetic,
        //   title: "Tài khoản",
        //   icons: <PiUserCircleDuotone />,
        //   key: "1-1",
        //   type: "title",
        //   disabled: true,
        // },
        // {
        //   path: routeConfig?.report_synthetic,
        //   title: "Đổi mật khẩu",
        //   icons: <PiLockKeyDuotone />,
        //   key: "1-2",
        //   type: "title",
        //   disabled: true,
        // },
        // {
        //   path: routeConfig?.report_synthetic,
        //   title: "Đỗi mật khẩu",
        //   icons: <PiChartPieLight />,
        //   key: "1-3",
        //   type: "title",
        // },
      ],
    },
    // {
    //   path: routeConfig?.report_synthetic,
    //   title: "Tin nhắn",
    //   type: "title",
    //   icons: <RiMessage3Fill />,
    //   key: "2",
    // },
    // {
    //   path: routeConfig?.report_synthetic,
    //   title: "Cài đặt",
    //   type: "title",
    //   icons: <IoSettingsSharp />,
    //   key: "3",
    // },
    {
      path: routeConfig?.report_synthetic,
      title: "Đăng xuất",
      type: "title",
      icons: <LiaPowerOffSolid />,
      key: "4",
      onClick: () => {
        api.modal?.confirm({
          title: "Xác nhận đăng xuất?",
          icon: null,
          content: "Đăng xuất khỏi tài khoản này",
          okText: "Đăng xuất",
          cancelText: "Huỷ",
          onOk: _app.logout,
          centered: true,
        })
      },
    },
  ]
}

export const HEADER_TREE_FOR_MODAL = (
  serverMenu: IServerMenu[],
): TreeDataNode[] => {
  const getMenu = (menu: IServerMenu): TreeDataNode => {
    const Icon = <IconC name={menu?.icon} />

    return {
      title: menu?.name,
      icon: Icon,
      key: menu?.id,
      children: menu?.child?.length
        ? menu?.child?.map?.((m) => getMenu(m))
        : undefined,
    }
  }

  return serverMenu?.map?.((menu, index) => {
    return getMenu(menu)
  })
}
