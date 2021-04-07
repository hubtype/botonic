import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const sessionStatePersistence = recoilPersist({
  key: 'botonicSession',
  storage: localStorage,
})

export const sessionState = atom({
  key: 'sessionState',
  default: { user: null },
  effects_UNSTABLE: [sessionStatePersistence.persistAtom],
  dangerouslyAllowMutability: true,
})
