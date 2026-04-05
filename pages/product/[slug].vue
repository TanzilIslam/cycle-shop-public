<template>
  <Breadcrumb :home="home" :model="breadcrumbItems" class="bg-surface-50">
    <template #item="{ item }">
      <NuxtLink class="cursor-pointer" :to="item.route">
        <span :class="item.icon"></span>
        {{ item.label }}
      </NuxtLink>
    </template>
    <template #separator> / </template>
  </Breadcrumb>

  <div class="mt-4">
    <!-- Product + Gallery -->
    <div class="grid grid-cols-12 gap-4 md:gap-10 mb-10">
      <!-- Gallery -->
      <div class="col-span-12 md:col-span-6">
        <img
          v-if="selectedTab === 'image'"
          :src="selectedImage"
          alt="product image"
          class="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
        />
        <video
          v-else-if="selectedTab === 'video'"
          :src="selectedVideo"
          controls
          class="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
        />
        <Tabs :value="selectedTab" @update:value="selectedTab = $event">
          <TabList>
            <Tab value="image">Images</Tab>
            <Tab value="video" v-if="product.videos?.length">Videos</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="image">
              <div class="w-full flex gap-4 items-center whitespace-nowrap overflow-x-auto mt-2">
                <img
                  v-for="image in product.images"
                  :key="image"
                  :src="image"
                  alt="product"
                  class="!w-60 !h-48 object-cover rounded-lg card cursor-pointer"
                  :class="{ '!border-1 !border-primary-500': selectedImage === image }"
                  @click="selectedImage = image"
                />
              </div>
            </TabPanel>
            <TabPanel value="video">
              <div class="w-full flex gap-4 items-center whitespace-nowrap overflow-x-auto mt-2">
                <video
                  v-for="video in product.videos"
                  :key="video"
                  :src="video"
                  class="!w-60 !h-48 object-cover rounded-lg card cursor-pointer"
                  :class="{ '!border-1 !border-primary-500': selectedVideo === video }"
                  @click="selectedVideo = video"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <!-- Product Info -->
      <div class="col-span-12 md:col-span-6">
        <div class="flex items-center gap-2 text-sm mb-4">
          <p class="bg-surface-200 dark:bg-surface-800 px-4 py-2 rounded">
            {{ product.store_categories?.name }}
          </p>
        </div>
        <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
        <div class="flex items-center mb-4">
          <span class="text-xl font-semibold">{{ product.price }} /- BDT</span>
        </div>
        <p class="text-surface-600 dark:text-surface-300 mb-6">
          {{ product.description }}
        </p>

        <!-- Specifications -->
        <Accordion :value="activeIndex" multiple>
          <AccordionPanel
            v-for="section in specSections"
            :key="section.id"
            :value="section.id"
          >
            <AccordionHeader>{{ section.name }}</AccordionHeader>
            <AccordionContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="specKey in filteredSpecKeys(section.id)"
                  :key="specKey.id"
                  class="flex flex-col"
                >
                  <span class="font-bold">
                    {{ specKey.name }}{{ specKey.unit ? ` (${specKey.unit})` : '' }}
                  </span>
                  <span>{{ getSpecValue(specKey.id) || 'N/A' }}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>

    <!-- Shop Info + Enquiry Form -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Shop Info -->
      <div class="col-span-12 md:col-span-6 card">
        <div class="text-2xl mb-4 border-b pb-4 gap-2 flex items-center">
          <i class="pi pi-map-marker"></i>
          <p>Our Shop</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <span class="text-sm">Shop Name</span>
            <span class="text-base font-semibold">{{ shop?.name || '—' }}</span>
          </div>
          <div class="flex flex-col" v-if="shop?.phone">
            <span class="text-sm">Phone</span>
            <a :href="`tel:${shop.phone}`" class="text-base font-semibold hover:underline">
              {{ shop.phone }}
            </a>
          </div>
          <div class="flex flex-col" v-if="shop?.whatsapp">
            <span class="text-sm">WhatsApp</span>
            <a :href="`https://wa.me/${shop.whatsapp}`" target="_blank" class="text-base font-semibold hover:underline">
              {{ shop.whatsapp }}
            </a>
          </div>
          <div class="flex flex-col" v-if="shop?.email">
            <span class="text-sm">Email</span>
            <a :href="`mailto:${shop.email}`" class="text-base font-semibold hover:underline">
              {{ shop.email }}
            </a>
          </div>
        </div>
        <div class="mt-4 pt-4" v-if="shop?.address">
          <span class="text-sm block mb-1">Address</span>
          <p class="text-lg font-bold">{{ shop.address }}</p>
        </div>
        <div class="mt-3 flex gap-4" v-if="shop?.map_link">
          <a :href="shop.map_link" target="_blank" class="inline-flex items-center text-sm font-medium hover:underline">
            View on Google Maps
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <!-- Social links -->
        <div class="mt-4 flex gap-4" v-if="shop?.facebook || shop?.instagram || shop?.youtube">
          <a v-if="shop.facebook" :href="shop.facebook" target="_blank" class="pi pi-facebook text-xl hover:text-primary-500"></a>
          <a v-if="shop.instagram" :href="shop.instagram" target="_blank" class="pi pi-instagram text-xl hover:text-primary-500"></a>
          <a v-if="shop.youtube" :href="shop.youtube" target="_blank" class="pi pi-youtube text-xl hover:text-primary-500"></a>
        </div>
      </div>

      <!-- Enquiry Form -->
      <div class="col-span-12 md:col-span-6 card">
        <p class="text-lg mb-4">Submit Your Query</p>
        <form @submit.prevent="submitEnquiry" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium">
              Name <span class="text-red-500">*</span>
            </label>
            <InputText id="name" v-model="enquiryForm.name" type="text" required class="w-full" />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium">
              Phone <span class="text-red-500">*</span>
            </label>
            <InputText id="phone" v-model="enquiryForm.phone" type="tel" required class="w-full" placeholder="017xxxxxxxx" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium">Email (Optional)</label>
            <InputText id="email" v-model="enquiryForm.email" type="email" class="w-full" />
          </div>
          <div>
            <label for="message" class="block text-sm font-medium">
              Message <span class="text-red-500">*</span>
            </label>
            <Textarea id="message" v-model="enquiryForm.message" rows="3" required class="w-full" />
          </div>
          <Button type="submit" :loading="isSubmitting" class="w-full">Submit Enquiry</Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Accordion from "@/volt/Accordion.vue";
import AccordionPanel from "@/volt/AccordionPanel.vue";
import AccordionHeader from "@/volt/AccordionHeader.vue";
import AccordionContent from "@/volt/AccordionContent.vue";
import Breadcrumb from "@/volt/Breadcrumb.vue";
import Button from "@/volt/Button.vue";
import InputText from "@/volt/InputText.vue";
import Textarea from "@/volt/Textarea.vue";
import Tabs from "@/volt/Tabs.vue";
import TabList from "@/volt/TabList.vue";
import Tab from "@/volt/Tab.vue";
import TabPanels from "@/volt/TabPanels.vue";
import TabPanel from "@/volt/TabPanel.vue";
import { useToast } from "primevue/usetoast";
import {
  SPECIFICATION_SECTION_TABLE,
  SPECIFICATION_KEY_TABLE,
  PRODUCT_SPECIFICATION_TABLE,
  PRODUCT_TABLE,
  CATEGORY_TABLE,
  USER_TABLE,
  ENQUIRY_TABLE,
} from "@/utils/db";
import { useShopId } from "@/utils/shopId";

const route = useRoute();
const supabase = useSupabaseClient();
const toast = useToast();
const shopId = useShopId();
const { origin } = useRequestURL();

const { slug } = route.params;

const [
  { data: product },
  { data: specSections },
  { data: allSpecKeys },
  { data: shop },
] = await Promise.all([
  supabase
    .from(PRODUCT_TABLE)
    .select(`*, ${CATEGORY_TABLE}(*)`)
    .eq("slug", slug)
    .eq("shop_id", shopId)
    .single(),
  supabase
    .from(SPECIFICATION_SECTION_TABLE)
    .select("*")
    .eq("shop_id", shopId)
    .order("display_order", { ascending: true }),
  supabase
    .from(SPECIFICATION_KEY_TABLE)
    .select("*")
    .eq("shop_id", shopId)
    .order("display_order", { ascending: true }),
  supabase
    .from(USER_TABLE)
    .select("name, description, logo_url, website, phone, whatsapp, email, address, map_link, facebook, instagram, youtube")
    .eq("id", shopId)
    .single(),
]);

if (!product) {
  throw createError({ statusCode: 404, statusMessage: "Product Not Found" });
}

const { data: productSpecsArray } = await supabase
  .from(PRODUCT_SPECIFICATION_TABLE)
  .select("spec_key_id, value")
  .eq("product_id", product.id);

const productSpecs = productSpecsArray || [];

const home = ref({ label: "Home", route: "/" });
const selectedImage = ref(product.images?.[0] || "");
const selectedVideo = ref(product.videos?.[0] || "");
const activeIndex = ref([specSections?.[0]?.id || "0"]);
const isSubmitting = ref(false);
const selectedTab = ref("image");

const enquiryForm = reactive({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const breadcrumbItems = computed(() => [
  { label: product.store_categories?.name, route: "/" },
  { label: product.name },
]);

const filteredSpecKeys = computed(() => (sectionId) => {
  return allSpecKeys.filter((k) => k.section_id === sectionId);
});

const getSpecValue = (specKeyId) => {
  const found = productSpecs.find((s) => s.spec_key_id === specKeyId);
  return found ? found.value : "";
};

const submitEnquiry = async () => {
  isSubmitting.value = true;

  if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.message) {
    toast.add({ severity: "warn", summary: "Name, Phone, and Message are required.", life: 3000 });
    isSubmitting.value = false;
    return;
  }

  try {
    const { error } = await supabase.from(ENQUIRY_TABLE).insert({
      shop_id: shopId,
      product_id: product.id,
      name: enquiryForm.name,
      email: enquiryForm.email || null,
      phone: enquiryForm.phone,
      message: enquiryForm.message,
    });

    if (error) throw error;

    toast.add({ severity: "success", summary: "Enquiry submitted successfully!", life: 3000 });
    enquiryForm.name = "";
    enquiryForm.email = "";
    enquiryForm.phone = "";
    enquiryForm.message = "";
  } catch (error) {
    console.error("Enquiry submission failed:", error);
    toast.add({ severity: "error", summary: "Submission failed. Please try again.", life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const productUrl = `${origin}/product/${product.slug}`;
const metaDescription = `${product.name} — Price: ${product.price} BDT. ${product.description?.substring(0, 120) || ""}`;

useHead({
  title: `${product.name} | ${shop?.name || "Store"}`,
  meta: [
    { name: "description", content: metaDescription },
    { name: "robots", content: "index, follow" },
    // Open Graph
    { property: "og:type", content: "product" },
    { property: "og:url", content: productUrl },
    { property: "og:title", content: `${product.name} | ${shop?.name || "Store"}` },
    { property: "og:description", content: product.description?.substring(0, 150) || "" },
    { property: "og:image", content: selectedImage.value || "" },
    { property: "og:site_name", content: shop?.name || "" },
    { property: "product:price:amount", content: String(product.price) },
    { property: "product:price:currency", content: "BDT" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${product.name} | ${shop?.name || "Store"}` },
    { name: "twitter:description", content: product.description?.substring(0, 150) || "" },
    { name: "twitter:image", content: selectedImage.value || "" },
  ],
  link: [{ rel: "canonical", href: productUrl }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: product.images?.length ? product.images : undefined,
        url: productUrl,
        offers: {
          "@type": "Offer",
          price: String(product.price),
          priceCurrency: "BDT",
          availability: product.is_active
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: productUrl,
          seller: { "@type": "Organization", name: shop?.name || "" },
        },
        brand: product.store_categories?.name
          ? { "@type": "Brand", name: product.store_categories.name }
          : undefined,
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          ...(product.store_categories?.name
            ? [{ "@type": "ListItem", position: 2, name: product.store_categories.name, item: origin }]
            : []),
          { "@type": "ListItem", position: product.store_categories?.name ? 3 : 2, name: product.name, item: productUrl },
        ],
      }),
    },
  ],
});
</script>
