import { useSupabaseClient } from '#imports'
import { USER_TABLE } from '@/utils/db'
import { useShopId } from '@/utils/shopId'

export const useShopInfo = () => {
  const supabase = useSupabaseClient()
  const shopId = useShopId()

  return useAsyncData('shop-info', async () => {
    const { data } = await supabase
      .from(USER_TABLE)
      .select('name, logo_url, description')
      .eq('id', shopId)
      .single()
    return data
  })
}
