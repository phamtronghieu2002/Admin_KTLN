import { FC } from "react"
import TabWrapper from "../../../../conponents/Tab/TabWrapper"
import { items } from "../item"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"
interface SpeakingProps {}

const Speaking: FC<SpeakingProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Speaking = categories.find(
    (category: any) => category.type === "Speaking",
  )?._id

  return <TabWrapper items={items(id_category_Speaking, "Speaking")} />
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Speaking />
    </ManagerCategoryProvider>
  )
}
