import { SUBMITED_WEBVIEW_PAYLOAD } from '../../../../server/constants'
import { FooterProps } from '../../shared-components/footer'
import { steps } from '../components/steps'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { Modal, setIsLoading, setModal, setViewStep } from '../redux/view-slice'
import { useWebviewRequestContext } from './use-webview-request-context'

export const useFooter = (): FooterProps => {
  const dispatch = useAppDispatch()
  const viewState = useAppSelector(state => state.view)
  const webviewRequestContext = useWebviewRequestContext()

  const handlePrevious = () => {
    if (viewState.numStep - 1 >= 0) {
      const value = steps[viewState.numStep - 1].value
      const numStep = steps[viewState.numStep - 1].numStep
      dispatch(
        setViewStep({
          value,
          numStep,
        })
      )
    }
    return
  }

  const handleNext = () => {
    if (viewState.numStep < steps.length - 1) {
      const value = steps[viewState.numStep + 1].value
      const numStep = steps[viewState.numStep + 1].numStep
      dispatch(
        setViewStep({
          value,
          numStep,
        })
      )
      return
    }
    if (viewState.numStep === steps.length - 1) {
      dispatch(setIsLoading({ isLoading: true }))
      dispatch(setModal({ modal: Modal.sent }))
      setTimeout(() => {
        void webviewRequestContext.closeWebview({
          payload: SUBMITED_WEBVIEW_PAYLOAD,
        })
        dispatch(setIsLoading({ isLoading: true }))
      }, 2000)
      return
    }
  }

  return {
    buttonTexts: {
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit',
    },
    footerState: viewState.footer,
    handlePrevious,
    handleNext,
    isFinalStep: viewState.numStep === steps.length - 1,
    isLoading: viewState.isLoading,
    numStep: viewState.numStep,
  }
}
