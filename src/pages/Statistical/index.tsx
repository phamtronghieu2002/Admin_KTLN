import { useAppSelector } from "../../app/hooks"
import { ActivedDayChart } from "./parts/ActivedDayChart"
import { ActivedMonthChart } from "./parts/ActivedMonthChart"
import { IntegratedStatistics } from "./parts/IntegratedStatistics"

interface IProps {
  userIdDefault?: number
  ignore?: string[]
}

export const Statisical: React.FC<IProps> = ({ userIdDefault, ignore }) => {
  const userInfo = useAppSelector((state) => state?.user?.access?.userInfo)
  const userId = userIdDefault || userInfo?.id

  return (
    <div className="flex flex-col gap-4">
      {ignore?.includes?.("IntegratedStatistics") ? null : (
        <div>{userId ? <IntegratedStatistics userId={userId} /> : null}</div>
      )}
      <div className="flex gap-4">
        <div className="flex-1">
          {userId ? <ActivedDayChart userId={userId} /> : null}
        </div>
        <div className="flex-1">
          {userId ? <ActivedMonthChart userId={userId} /> : null}
        </div>
      </div>
    </div>
  )
}
