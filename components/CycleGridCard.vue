<template>
  <div
    class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500"
  >
    <div class="grid grid-cols-12 gap-4 h-full">
      <img
        :src="props.cycle.photos?.[0] || ''"
        class="col-span-12 w-full h-full object-cover rounded-tl-2xl rounded-tr-2xl"
        alt=""
      />
      <div class="col-span-12 p-4">
        <h3 class="text-2xl font-bold">{{ props.cycle?.model_name }}</h3>
        <p class="text-sm mb-4 mt-1">
          {{ props.cycle?.cycle_shop_categories?.name }} |
          {{ props.cycle?.cycle_shop_brand?.name }}
        </p>

        <div class="flex justify-between items-center gap-2">
          <p class="text-base">Price: {{ props.cycle?.price }} BDT</p>
          <Button
            label="View Details"
            variant="outlined"
            @click="$router.push(`/cycle/${props.cycle?.slug}`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Button from "@/volt/Button.vue";
const props = defineProps({
  cycle: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});
</script>
