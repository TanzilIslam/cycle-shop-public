<template>
  <div
    class="card !p-0 hover:translate-y-[-15px] transition-all cursor-pointer hover:shadow-lg duration-500 mb-10"
  >
    <div class="grid grid-cols-12 gap-4 h-full items-center">
      <img
        :src="props.cycle.photos?.[0] || ''"
        class="col-span-12 md:col-span-6 w-full h-full object-cover rounded-tr-2xl rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-0"
        alt=""
      />
      <div class="col-span-12 md:col-span-6 p-4">
        <h3 class="text-2xl font-bold">{{ props.cycle?.model_name }}</h3>
        <p class="text-sm mb-4 mt-1">
          {{ props.cycle?.cycle_shop_categories?.name }} |
          {{ props.cycle?.cycle_shop_brand?.name }}
        </p>
        <p>Price: {{ props.cycle?.price }}</p>
        <div class="flex mt-4">
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
    required: true,
  },
});
</script>
