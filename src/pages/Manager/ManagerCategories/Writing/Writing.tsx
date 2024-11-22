import { FC } from "react"
import TabWrapper from "../../../../conponents/Tab/TabWrapper"
import { items } from "../item"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"
interface WritingProps {}

const Writing: FC<WritingProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Writing = categories.find(
    (category: any) => category.type === "Writing",
  )?._id

  return <TabWrapper items={items(id_category_Writing, "Writing")} />
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Writing />
    </ManagerCategoryProvider>
  )
}
