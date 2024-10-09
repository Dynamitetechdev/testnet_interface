import { pool } from '@/app/constants/poolOptions'
import { MAINNET_DETAILS, TESTNET_DETAILS } from '@/app/helpers/network'
import { create } from 'zustand'

const UseStore: any = create((set: any) => ({
    connectorWalletAddress: null,
    userBalance: 0.00,
    poolReserve: {},
    selectedNetwork: TESTNET_DETAILS,
    transactionsStatus: {},
    selectedPool: {},
    selectedFarmPool: {},
    allPools: pool,
    walletNetwork: null,
    setUserBalance: (balance: string) => set(() => ({userBalance: balance})),
    setConnectorWalletAddress: (address: string) => set(() => ({ connectorWalletAddress: address })),
    setPoolReserve: (value: string) => set(() => ({poolReserve: value})),
    setSelectedNetwork: (network: any) => set(() => ({selectedNetwork: network})),
    setTransactionsStatus: (data: any) => set(() => ({transactionsStatus: data})),
    setSelectedPool: (data: any) => set(() => ({selectedPool: data})),
    setSelectedFarmPool: (data: any) => set(() => ({selectedFarmPool: data})),
    setAllPools: (data: any) => set(() => ({allPools: data})),
    setWalletNetwork: (data: any) => set(() => ({walletNetwork: data}))
}))

export default UseStore