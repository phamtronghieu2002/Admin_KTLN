import { UploadProps } from "antd"
import { GetProp } from "antd/lib"

export interface IServerMenu {
  component: string
  icon: string
  id: number
  link: string
  lv: number
  name: string
  parent_id: number
  child: IServerMenu[]
  type: string
}

export interface IInterface {
  content: string
  created_at: number
  id: number
  keyword: string
  name: string
  publish: number
  updated_at: number
}

export interface IInterfaceDetail {
  content: string
  id: number
  keyword: string
  name: string
  publish: number
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

export interface IPathList {
  path: string
  url: string
  property: string
}