<template>
  <div class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500 mb-10">
    <div class="grid grid-cols-12 gap-4 h-full items-center">
      <img
        :src="props.product.images?.[0] || ''"
        class="col-span-12 md:col-span-6 w-full h-full object-cover rounded-tr-2xl rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none"
        alt=""
      />
      <div class="col-span-12 md:col-span-6 p-4">
        <h3 class="text-2xl font-bold">{{ props.product?.name }}</h3>
        <p class="text-sm mb-4 mt-1">
          {{ props.product?.store_categories?.name }}
        </p>
        <p>Price: {{ props.product?.price }} BDT</p>
        <p class="text-xs text-surface-400 mt-1">
          <i class="pi pi-eye mr-1"></i>{{ props.product?.view_count ?? 0 }} views
        </p>
        <div class="flex mt-4">
          <Button
            label="View Details"
            variant="outlined"
            @click="$router.push(`/product/${props.product?.slug}`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/volt/Button.vue";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
