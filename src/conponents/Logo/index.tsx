import { useAppSelector } from "../../app/hooks"

interface IProps {
  style?: React.CSSProperties
}

export const Logo: React.FC<IProps> = ({ style = {} }) => {
  const pageInterface = useAppSelector((state) => state?.interface?.page)

  const staticURL = pageInterface?.sv_static_file
  const logo = pageInterface?.logo
  const logoURL = `https://res.cloudinary.com/dzpj1y0ww/image/upload/v1726329324/IELTS_ttwgqh.png`

  return (
    <div className="h-full items-center flex">
      <img
        width={50}
        height={50}
        crossOrigin="anonymous"
        style={style}
        className="h-full"
        alt="logo"
        src={logoURL}
      />
    </div>
  )
}

export const UserAvatar: React.FC<IProps> = ({ style = {} }) => {
  return (
    <div className="h-full items-center flex">
      <img
        style={style}
        className="h-full"
        alt="logo"
        src="/assets/images/user_avatar.png"
      />
    </div>
  )
}
