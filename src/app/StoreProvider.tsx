/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from '../lib/store'

export default function StoreProvider({
  children,
}: {
    children: React.ReactNode,
}): React.ReactNode {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
