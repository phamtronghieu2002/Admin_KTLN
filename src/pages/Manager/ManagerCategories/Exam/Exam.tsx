import { FC } from "react"
import TabWrapper from "../../../../conponents/Tab/TabWrapper"
import { items } from "../item"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"
interface ExamProps {}

const Exam: FC<ExamProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Exam = categories.find(
    (category: any) => category.type === "Exam",
  )?._id

  return <TabWrapper items={items(id_category_Exam, "Exam", true)} />
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Exam />
    </ManagerCategoryProvider>
  )
}
