import { FC } from "react"
import TabWrapper from "../../../../conponents/Tab/TabWrapper"
import { items } from "../item"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"
interface ReadingProps {}

const Reading: FC<ReadingProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Reading = categories.find(
    (category: any) => category.type === "Reading",
  )?._id

  return <TabWrapper items={items(id_category_Reading, "Reading")} />
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Reading />
    </ManagerCategoryProvider>
  )
}
