<template>
  <div class="grid grid-cols-12 gap-2">
    <div
      class="col-span-12 md:col-span-3 md:h-[calc(100vh-4rem)] overflow-y-auto p-4 card md:sticky top-0 z-10"
    >
      <div class="flex flex-col gap-4">
        <SelectButton v-model="view" :options="viewOptions" />

        <!-- Search -->
        <InputText
          v-model="search"
          placeholder="Search Model/Description"
          class="w-full"
        />

        <!-- Sort By -->
        <Select
          v-model="sortBy"
          :options="sortOptions"
          optionLabel="name"
          placeholder="Sort By"
          class="w-full"
        />

        <!-- Filter By Brand -->
        <Select
          v-model="selectedBrand"
          :options="brands"
          optionLabel="name"
          placeholder="Select Brand"
          class="w-full"
          :showClear="true"
        />

        <!-- Filter By Category -->
        <Select
          v-model="selectedCategory"
          :options="categories"
          optionLabel="name"
          placeholder="Select Category"
          class="w-full"
          :showClear="true"
        />

        <!-- Action Buttons -->
        <div class="grid grid-cols-12 gap-2 mt-2">
          <Button
            class="col-span-6"
            label="Reset"
            variant="outlined"
            @click="reset"
          />
          <Button
            class="col-span-6"
            label="Apply"
            variant="primary"
            @click="apply"
          />
        </div>
      </div>
    </div>

    <!-- Cycle List/Grid Area -->
    <div class="col-span-12 md:col-span-9">
      <!-- No Results State -->
      <div
        v-if="filteredCycles.length === 0"
        class="p-8 text-center bg-white rounded-xl shadow-lg"
      >
        <h3 class="text-xl font-semibold text-red-500">No Cycles Found!</h3>
        <p class="text-gray-600 mt-2">
          Try adjusting your filters or search terms.
        </p>
      </div>

      <!-- Cycles Display (Grid/List) -->
      <div v-else class="grid grid-cols-12 gap-4 break-words">
        <div
          v-for="cycle in filteredCycles"
          :key="cycle.id"
          :class="`col-span-12 ${
            view === 'Grid View' ? 'md:col-span-6 lg:col-span-4' : ''
          }`"
        >
          <CycleGridCard v-if="view === 'Grid View'" :cycle="cycle" />
          <CycleListCard v-else :cycle="cycle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSupabaseClient } from "#imports";

import Button from "@/volt/Button.vue";
import Select from "@/volt/Select.vue";
import InputText from "@/volt/InputText.vue";
import SelectButton from "@/volt/SelectButton.vue";
import CycleGridCard from "@/components/CycleGridCard.vue";
import CycleListCard from "@/components/CycleListCard.vue";
import { BRAND_TABLE, CATEGORY_TABLE, CYCLE_TABLE } from "@/utils/db";

const supabase = useSupabaseClient();

const { data: brands } = await supabase.from(BRAND_TABLE).select("*");
const { data: categories } = await supabase.from(CATEGORY_TABLE).select("*");

const { data: initialCycles, error: cycleError } = await supabase
  .from(CYCLE_TABLE)
  .select(`*,${BRAND_TABLE}(*),${CATEGORY_TABLE}(*)`);

if (cycleError) console.error("Error fetching cycles:", cycleError.message);

const cycles = ref(initialCycles || []);
const filteredCycles = ref(initialCycles || []);

const selectedBrand = ref(null);
const selectedCategory = ref(null);
const search = ref("");
const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
];
// Default sort is set to newest
const sortBy = ref(sortOptions[0]);
const viewOptions = ["Grid View", "List View"];
const view = ref("Grid View");

const apply = () => {
  let result = [...cycles.value];

  if (selectedBrand.value) {
    result = result.filter(
      (cycle) => cycle.brand_id === selectedBrand.value.id
    );
  }

  if (selectedCategory.value) {
    result = result.filter(
      (cycle) => cycle.category_id === selectedCategory.value.id
    );
  }

  if (search.value) {
    const searchTerm = search.value.toLowerCase().trim();
    result = result.filter(
      (cycle) =>
        cycle.model_name.toLowerCase().includes(searchTerm) ||
        (cycle.description &&
          cycle.description.toLowerCase().includes(searchTerm))
    );
  }

  if (sortBy.value) {
    switch (sortBy.value.value) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  filteredCycles.value = result;
};

const reset = () => {
  selectedBrand.value = null;
  selectedCategory.value = null;
  search.value = "";
  sortBy.value = sortOptions[0];
  apply();
};
</script>
