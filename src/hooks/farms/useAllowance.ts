import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useSushi from './useSushi'
import { useWeb3React } from '@web3-react/core'
// import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../../sushi/format/erc20'
import { getMasterChefContract } from '../../sushi/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  // const { account }: { account: string | null; ethereum: provider } = useWallet()
  const { account } = useWeb3React()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      masterChefContract,
      // @ts-ignore
      account,
    )
    debugger
    setAllowance(new BigNumber(allowance))
  }, [account, masterChefContract, lpContract])

  useEffect(() => {
    if (account && masterChefContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, masterChefContract, lpContract])

  return allowance
}

export default useAllowance
