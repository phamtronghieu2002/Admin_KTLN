import { FC } from "react"
import { IntegratedStatistics } from "../Statistical/parts/IntegratedStatistics"
import { useAppSelector } from "../../app/hooks"
import ActivedMonthChart from "../Statistical/parts/ActivedMonthChart"
import LessonByCategoryChart from "../Statistical/parts/ActivedDayChart"

interface IntroductionProps {}

const Introduction: FC<IntroductionProps> = () => {
  const userInfo = useAppSelector((state) => state?.user?.access?.userInfo)
  const userId = userInfo?.id || 123

  return (
    <div className="flex flex-col gap-4">
      <IntegratedStatistics userId={userId} />
      <div className="flex gap-4">
        <div className="flex-1">
          <ActivedMonthChart />
        </div>
        <div className="flex-1">
          <LessonByCategoryChart/>
        </div>
      </div>
    </div>
  )
}

export default Introduction
