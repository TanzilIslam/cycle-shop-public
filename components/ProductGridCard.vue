<template>
  <NuxtLink :to="`/product/${props.product?.slug}`" class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500 block">
    <div class="grid grid-cols-12 gap-4 h-full">
      <img
        v-if="props.product.images?.[0]"
        :src="props.product.images[0]"
        class="col-span-12 w-full h-48 object-cover rounded-tl-2xl rounded-tr-2xl"
        alt=""
      />
      <div
        v-else
        class="col-span-12 w-full h-48 rounded-tl-2xl rounded-tr-2xl bg-surface-100 dark:bg-surface-800 flex flex-col items-center justify-center gap-2 text-surface-400"
      >
        <i class="pi pi-image text-4xl"></i>
        <span class="text-xs">No Image</span>
      </div>
      <div class="col-span-12 p-4">
        <h3 class="text-2xl font-bold">{{ props.product?.name }}</h3>
        <p v-if="props.product?.tagline" class="text-xs text-surface-500 dark:text-surface-400 italic mt-1">{{ props.product.tagline }}</p>
        <p class="text-sm mb-4 mt-1">
          {{ props.product?.store_categories?.name }}
        </p>
        <div class="flex justify-between items-center gap-2">
          <p class="text-base">Price: {{ props.product?.price }} BDT</p>
        </div>
        <p v-if="props.product?.price_note" class="text-xs text-surface-400 mt-1">{{ props.product.price_note }}</p>
        <p class="text-xs text-surface-400 mt-2">
          <i class="pi pi-eye mr-1"></i>{{ props.product?.view_count ?? 0 }} views
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
