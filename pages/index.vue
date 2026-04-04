<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12 md:col-span-3 md:h-[calc(100vh-4rem)] overflow-y-auto p-4 card md:sticky top-0 z-10">
      <div class="flex flex-col gap-4">
        <SelectButton v-model="view" :options="viewOptions" />

        <!-- Search -->
        <InputText v-model="search" placeholder="Search products..." class="w-full" />

        <!-- Sort By -->
        <Select
          v-model="sortBy"
          :options="sortOptions"
          optionLabel="name"
          placeholder="Sort By"
          class="w-full"
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
          <Button class="col-span-6" label="Reset" variant="outlined" @click="reset" />
          <Button class="col-span-6" label="Apply" variant="primary" @click="apply" />
        </div>
      </div>
    </div>

    <!-- Product List/Grid Area -->
    <div class="col-span-12 md:col-span-9">
      <div v-if="filteredProducts.length === 0" class="p-8 text-center bg-white rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-red-500">No Products Found!</h3>
        <p class="text-gray-600 mt-2">Try adjusting your filters or search terms.</p>
      </div>

      <div v-else class="grid grid-cols-12 gap-4 break-words">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          :class="`col-span-12 ${view === 'Grid View' ? 'md:col-span-6 lg:col-span-4' : ''}`"
        >
          <ProductGridCard v-if="view === 'Grid View'" :product="product" />
          <ProductListCard v-else :product="product" />
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
import ProductGridCard from "@/components/ProductGridCard.vue";
import ProductListCard from "@/components/ProductListCard.vue";
import { CATEGORY_TABLE, PRODUCT_TABLE, SHOP_TABLE } from "@/utils/db";
import { useShopId } from "@/utils/shopId";

const supabase = useSupabaseClient();
const shopId = useShopId();
const { origin } = useRequestURL();

const [
  { data: categories },
  { data: initialProducts, error: productError },
  { data: shop },
] = await Promise.all([
  supabase.from(CATEGORY_TABLE).select("*").eq("shop_id", shopId),
  supabase.from(PRODUCT_TABLE).select(`*, ${CATEGORY_TABLE}(*)`).eq("shop_id", shopId).eq("is_active", true),
  supabase.from(SHOP_TABLE).select("name, description, logo_url, website, phone, email, address, facebook, instagram, youtube").eq("id", shopId).single(),
]);

if (productError) console.error("Error fetching products:", productError.message);

const sameAs = [shop?.facebook, shop?.instagram, shop?.youtube, shop?.website].filter(Boolean);

useHead({
  title: shop?.name || "Store",
  meta: [
    { name: "description", content: shop?.description || `Browse all products at ${shop?.name || "our store"}.` },
    { name: "robots", content: "index, follow" },
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:url", content: origin },
    { property: "og:title", content: shop?.name || "Store" },
    { property: "og:description", content: shop?.description || `Browse all products at ${shop?.name || "our store"}.` },
    { property: "og:image", content: shop?.logo_url || "" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: shop?.name || "Store" },
    { name: "twitter:description", content: shop?.description || "" },
    { name: "twitter:image", content: shop?.logo_url || "" },
  ],
  link: [{ rel: "canonical", href: origin }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: shop?.name || "",
        url: shop?.website || origin,
        logo: shop?.logo_url || "",
        description: shop?.description || "",
        telephone: shop?.phone || "",
        email: shop?.email || "",
        address: shop?.address ? { "@type": "PostalAddress", streetAddress: shop.address } : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: shop?.name || "",
        url: shop?.website || origin,
      }),
    },
  ],
});

const products = ref(initialProducts || []);
const filteredProducts = ref(initialProducts || []);

const selectedCategory = ref(null);
const search = ref("");
const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
];
const sortBy = ref(sortOptions[0]);
const viewOptions = ["Grid View", "List View"];
const view = ref("Grid View");

const apply = () => {
  let result = [...products.value];

  if (selectedCategory.value) {
    result = result.filter((p) => p.category_id === selectedCategory.value.id);
  }

  if (search.value) {
    const searchTerm = search.value.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
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

  filteredProducts.value = result;
};

const reset = () => {
  selectedCategory.value = null;
  search.value = "";
  sortBy.value = sortOptions[0];
  apply();
};
</script>
