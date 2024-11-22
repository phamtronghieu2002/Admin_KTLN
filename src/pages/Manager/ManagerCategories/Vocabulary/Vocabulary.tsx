import { FC } from "react"
import Lesson from "../components/Lesson"
import { useAppSelector } from "../../../../app/hooks"
import ManagerCategoryProvider from "../Provider/ManagerCategoryProvider"

interface VocabularyProps {}

const Vocabulary: FC<VocabularyProps> = () => {
  const categories = useAppSelector((state) => state.app.categories)

  const id_category_Vocabulary = categories.find(
    (category: any) => category.type === "Vocabulary",
  )?._id
  return (
    <div>
      <Lesson category_id={id_category_Vocabulary} type_category="Vocabulary" />
    </div>
  )
}

export default () => {
  return (
    <ManagerCategoryProvider>
      <Vocabulary />
    </ManagerCategoryProvider>
  )
}
