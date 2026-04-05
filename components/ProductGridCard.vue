<template>
  <div class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500">
    <div class="grid grid-cols-12 gap-4 h-full">
      <img
        :src="props.product.images?.[0] || ''"
        class="col-span-12 w-full h-48 object-cover rounded-tl-2xl rounded-tr-2xl"
        alt=""
      />
      <div class="col-span-12 p-4">
        <h3 class="text-2xl font-bold">{{ props.product?.name }}</h3>
        <p class="text-sm mb-4 mt-1">
          {{ props.product?.store_categories?.name }}
        </p>
        <div class="flex justify-between items-center gap-2">
          <p class="text-base">Price: {{ props.product?.price }} BDT</p>
          <Button
            label="View Details"
            variant="outlined"
            @click="$router.push(`/product/${props.product?.slug}`)"
          />
        </div>
        <p class="text-xs text-surface-400 mt-2">
          <i class="pi pi-eye mr-1"></i>{{ props.product?.view_count ?? 0 }} views
        </p>
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
