import { FC } from "react"
import TabWrapper from "../../../../conponents/Tab/TabWrapper"
import { items } from "../item"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"
import Lesson from "../components/Lesson"
interface GrammarProps {}

const Grammar: FC<GrammarProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Grammar = categories.find(
    (category: any) => category.type === "Grammar",
  )?._id

  return  <Lesson 
   category_id={id_category_Grammar}
   type_category={"Grammar"}
  />
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Grammar />
    </ManagerCategoryProvider>
  )
}
