import { useAppDispatch } from '../redux/hooks'
import { setViewFooter } from '../redux/view-slice'

interface DisableFooterProps {
  primary: boolean
  secondary?: boolean
}

export const useDisableFooter = () => {
  const dispatch = useAppDispatch()

  const disableFooter = ({
    primary,
    secondary = false,
  }: DisableFooterProps) => {
    dispatch(
      setViewFooter({
        primary: {
          disabled: primary,
        },
        secondary: {
          disabled: secondary,
        },
      })
    )
  }

  return { disableFooter }
}
