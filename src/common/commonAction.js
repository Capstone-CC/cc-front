export const PUSH_TOAST = 'PUSH_TOAST';
export const POP_TOAST = 'POP_TOAST'
export const SHOW_LAYER = 'SHOW_LAYER'
export const HIDE_LAYER = 'HIDE_LAYER'

export const pushToast = (message, time = 2000) => ({
  type: PUSH_TOAST,
  payload: {
    message,
    time,
  }
})

export const popToast = () => ({
  type: POP_TOAST
})

export const showLayer = ({
  message = '',
  onCancel = () => null,
  onAgree = () => null,
  cancel = '취소',
  agree = '확인',
}) => ({
  type: SHOW_LAYER,
  payload: {
    message,
    onCancel,
    onAgree,
    cancel,
    agree,
  }
})

export const hideLayer = () => ({
  type: HIDE_LAYER
})