export const useShopId = (): string => {
  const config = useRuntimeConfig()
  return config.public.shopId as string
}
