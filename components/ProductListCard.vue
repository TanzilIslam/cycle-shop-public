<template>
  <NuxtLink :to="`/product/${props.product?.slug}`" class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500 mb-10 block">
    <div class="grid grid-cols-12 gap-4 h-full items-center">
      <img
        v-if="props.product.images?.[0]"
        :src="props.product.images[0]"
        class="col-span-12 md:col-span-6 w-full h-full object-cover rounded-tr-2xl rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none"
        alt=""
      />
      <div
        v-else
        class="col-span-12 md:col-span-6 w-full min-h-48 rounded-tr-2xl rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none bg-surface-100 dark:bg-surface-800 flex flex-col items-center justify-center gap-2 text-surface-400"
      >
        <i class="pi pi-image text-4xl"></i>
        <span class="text-xs">No Image</span>
      </div>
      <div class="col-span-12 md:col-span-6 p-4">
        <h3 class="text-2xl font-bold">{{ props.product?.name }}</h3>
        <p v-if="props.product?.tagline" class="text-xs text-surface-500 dark:text-surface-400 italic mt-1">{{ props.product.tagline }}</p>
        <p class="text-sm mb-4 mt-1">
          {{ props.product?.store_categories?.name }}
        </p>
        <p>Price: {{ props.product?.price }} BDT</p>
        <p v-if="props.product?.price_note" class="text-xs text-surface-400 mt-1">{{ props.product.price_note }}</p>
        <p class="text-xs text-surface-400 mt-1">
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
