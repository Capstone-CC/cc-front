export const PUSH_TOAST = 'PUSH_TOAST';
export const POP_TOAST = 'POP_TOAST'

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