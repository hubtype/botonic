import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from './store'

export enum ViewStep {
  firstStep = 'FIRST_STEP',
  secondStep = 'SECOND_STEP',
  lastStep = 'LAST_STEP',
}

export enum Modal {
  sent = 'Sent',
}

export interface ViewState {
  value: ViewStep
  numStep: number
  footer: {
    primary: {
      disabled: boolean
    }
    secondary: {
      disabled: boolean
    }
  }
  isLoading: boolean
  modal?: Modal
  isWhatsAppDesktop?: boolean
}

const initialState: ViewState = {
  value: ViewStep.firstStep,
  numStep: 0,
  footer: {
    primary: { disabled: false },
    secondary: { disabled: false },
  },
  isLoading: false,
  modal: undefined,
  isWhatsAppDesktop: undefined,
}

export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewStep: (
      state: ViewState,
      action: PayloadAction<{ value: ViewStep; numStep: number }>
    ) => {
      state.value = action.payload.value
      state.numStep = action.payload.numStep
    },
    setViewFooter: (
      state: ViewState,
      action: PayloadAction<{
        primary: {
          disabled: boolean
        }
        secondary: {
          disabled: boolean
        }
      }>
    ) => {
      state.footer = action.payload
    },
    setIsLoading: (
      state: ViewState,
      action: PayloadAction<{ isLoading: boolean }>
    ) => {
      state.isLoading = action.payload.isLoading
    },
    setModal: (state: ViewState, action: PayloadAction<{ modal?: Modal }>) => {
      state.modal = action.payload.modal
    },
    setWhatsAppDesktop: (
      state: ViewState,
      action: PayloadAction<{ isWhatsAppDesktop?: boolean }>
    ) => {
      state.isWhatsAppDesktop = action.payload.isWhatsAppDesktop
    },
  },
})

export const {
  setViewStep,
  setViewFooter,
  setIsLoading,
  setModal,
  setWhatsAppDesktop,
} = viewSlice.actions

export const view = (state: RootState): ViewState => state.view

export default viewSlice.reducer
