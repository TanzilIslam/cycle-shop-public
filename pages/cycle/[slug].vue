<template>
  <Breadcrumb :home="home" :model="items" class="bg-surface-50">
    <template #item="{ item }">
      <NuxtLink class="cursor-pointer" :to="item.route">
        <span :class="item.icon"></span>
        {{ item.label }}
      </NuxtLink>
    </template>
    <template #separator> / </template>
  </Breadcrumb>
  <div class="mt-4">
    <div class="grid grid-cols-12 gap-4 md:gap-10 mb-10">
      <div class="col-span-12 md:col-span-6">
        <img
          v-if="selectedTab === 'image'"
          :src="selectedPhoto"
          alt="cycle.name"
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
            <Tab value="image">Image</Tab>
            <Tab value="video">Video</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="image">
              <div
                class="w-full flex gap-4 items-center whitespace-nowrap overflow-x-auto mt-2"
              >
                <img
                  v-for="photo in cycle.photos"
                  :key="photo"
                  :src="photo"
                  alt="cycle.name"
                  class="!w-60 !h-48 object-cover rounded-lg card"
                  :class="{
                    '!border-1 !border-primary-500': selectedPhoto === photo,
                  }"
                  @click="selectedPhoto = photo"
                />
              </div>
            </TabPanel>
            <TabPanel value="video">
              <div
                class="w-full flex gap-4 items-center whitespace-nowrap overflow-x-auto mt-2"
              >
                <video
                  v-for="video in cycle.videos"
                  :key="video"
                  :src="video"
                  class="!w-60 !h-48 object-cover rounded-lg card"
                  :class="{
                    '!border-1 !border-primary-500': selectedVideo === video,
                  }"
                  @click="selectedVideo = video"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div class="flex items-center gap-2 text-sm mb-4">
          <p class="bg-surface-200 dark:bg-surface-800 px-4 py-2 rounded `">
            {{ cycle[CATEGORY_TABLE]?.name }}
          </p>
          <i class="pi pi-circle-fill text-surface-600 text-[5px]"></i>
          <p class="text-surface-600 dark:text-surface-400 font-bold">
            {{ cycle[BRAND_TABLE]?.name }}
          </p>
        </div>
        <h1 class="text-2xl font-bold mb-2">{{ cycle.model_name }}</h1>
        <div class="flex items-center mb-4">
          <span class="text-xl font-semibold">{{ cycle.price }} /- BDT</span>
        </div>
        <p class="text-surface-600 dark:text-surface-300 mb-6 !w-full">
          {{ cycle.description }}
        </p>
        <Accordion :value="activeIndex" multiple>
          <AccordionPanel
            v-for="section in specificationsSection"
            :key="section.id"
            :value="section.id"
          >
            <AccordionHeader>
              {{ section.name }}
            </AccordionHeader>

            <AccordionContent>
              <!-- USER-FRIENDLY SPECIFICATION GRID -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="specKey in filteredSpecKeys(section.id)"
                  :key="specKey.id"
                  class="flex flex-col"
                >
                  <!-- Specification Key (Label) -->
                  <span class="font-bold">
                    {{ specKey.name }}
                  </span>
                  <!-- Specification Value (Highlighted) -->
                  <span>
                    {{ getSpecValue(specKey.id) || "Not Applicable" }}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6 card">
        <div class="text-2xl mb-4 border-b pb-4 gap-2 flex items-center">
          <i class="pi pi-map-marker"></i>
          <p>Our Shop Address</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <!-- Shop Name/Title -->
          <div class="flex flex-col">
            <span class="text-sm">Shop Name</span>
            <span class="text-base font-semibold">My Cycle Shop</span>
          </div>
          <!-- Phone -->
          <div class="flex flex-col">
            <span class="text-sm">Phone (WhatsApp)</span>
            <a
              href="tel:+8801234567890"
              class="text-base font-semibold hover:underline"
            >
              +880 1234 567890
            </a>
          </div>
          <!-- Hours -->
          <div class="flex flex-col">
            <span class="text-sm">Hours</span>
            <span class="text-base font-semibold">9AM - 8PM</span>
          </div>
        </div>

        <div class="mt-4 pt-4">
          <span class="text-sm block mb-1">Address</span>
          <p class="text-lg font-bold">123, Main Road, Dhaka, Bangladesh</p>
          <!-- Add a simple map link -->
          <a
            href="https://maps.app.goo.gl/YourGoogleMapsLink"
            target="_blank"
            class="inline-flex items-center text-sm font-medium transition"
          >
            Google Map
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 card">
        <div class="">
          <p class="text-lg mb-4">Submit Your Query</p>
          <form @submit.prevent="submitEnquiry" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium"
                >Name: <span class="text-red-500">*</span></label
              >
              <InputText
                id="name"
                v-model="enquiryForm.name"
                type="text"
                required
                class="w-full"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium"
                >Phone Number<span class="text-red-500">*</span></label
              >
              <InputText
                id="phone"
                v-model="enquiryForm.phone"
                type="tel"
                required
                class="w-full"
                placeholder="017xxxxxxxx"
              />
            </div>

            <!-- NEW FIELD: Email -->
            <div>
              <label for="email" class="block text-sm font-medium"
                >Email (Optional):</label
              >
              <InputText
                id="email"
                v-model="enquiryForm.email"
                type="email"
                class="w-full"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium"
                >Your Question<span class="text-red-500">*</span></label
              >
              <Textarea
                id="message"
                v-model="enquiryForm.message"
                rows="3"
                required
                class="w-full"
              />
            </div>

            <Button type="submit" :loading="isSubmitting" class="w-full">
              Submit Enquiry
            </Button>
          </form>
        </div>
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
import Toast from "@/volt/Toast.vue";
import { useToast } from "primevue/usetoast";

import {
  SPECIFICATION_SECTION_TABLE,
  SPECIFICATION_KEY_TABLE,
  CYCLE_SPECIFICATION_TABLE,
  CYCLE_TABLE,
  BRAND_TABLE,
  CATEGORY_TABLE,
  ENQUIRY_TABLE,
} from "@/utils/db";

const route = useRoute();
const supabase = useSupabaseClient();
const toast = useToast();

const { slug } = route.params;

const [
  { data: cycle },
  { data: specificationsSection },
  { data: allSpecKeys },
] = await Promise.all([
  supabase
    .from(CYCLE_TABLE)
    .select(`*, ${BRAND_TABLE}(*), ${CATEGORY_TABLE}(*)`)
    .eq("slug", slug)
    .single()
    .then((res) => {
      return res;
    }),

  supabase
    .from(SPECIFICATION_SECTION_TABLE)
    .select(`*`)
    .order("id", { ascending: true }),
  supabase
    .from(SPECIFICATION_KEY_TABLE)
    .select(`*`)
    .order("id", { ascending: true }),
]);

if (!cycle) {
  throw createError({ statusCode: 404, statusMessage: "Cycle Not Found" });
}
const { data: cycleSpecsArray } = await supabase
  .from(CYCLE_SPECIFICATION_TABLE)
  .select("spec_key_id, value")
  .eq("cycle_id", cycle.id);

const cycleSpecs = cycleSpecsArray || [];

const WHATSAPP_NUMBER = "8801700000000";
const DEFAULT_SHOP_ID = "09a13756-9460-40b1-b1f0-a8842ebaea01";
const DEFAULT_STATUS = "New";

const home = ref({
  label: "Home",
  route: "/",
});

const selectedPhoto = ref(cycle.photos?.[0] || "");
const selectedVideo = ref(cycle.videos?.[0] || "");
const activeIndex = ref([specificationsSection?.[0]?.id || "0"]);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const selectedTab = ref("image");
const currentViews = ref(cycle.views);

const enquiryForm = reactive({
  name: "3434",
  email: "334@gmail.com",
  phone: "343",
  message: "34343",
});

const filteredSpecKeys = computed(() => (sectionId) => {
  return allSpecKeys.filter((specKey) => specKey.spec_section_id === sectionId);
});
const items = computed(() => [
  {
    label: cycle[CATEGORY_TABLE]?.name,
    to: `/cycles?category=${cycle[CATEGORY_TABLE]?.slug}`,
  },
  { label: cycle[BRAND_TABLE]?.name },
]);

const getSpecValue = (specKeyId) => {
  const foundSpec = cycleSpecs.find((s) => s.spec_key_id === specKeyId);
  return foundSpec ? foundSpec.value : "";
};

const updateCycleViews = async () => {
  if (cycle) {
    // Note: No error handling needed here as it is passive tracking
    await supabase
      .from(CYCLE_TABLE)
      .update({ views: cycle.views + 1 })
      .eq("slug", cycle.slug);

    // Update local state for immediate display
    currentViews.value = cycle.views + 1;
  }
};

const submitEnquiry = async () => {
  successMessage.value = "";
  errorMessage.value = "";
  isSubmitting.value = true;

  // Validation: Check mandatory fields
  // phone is nullable in DB, but required for instant communication
  // message is NOT NULL in your schema, so we enforce it
  if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.message) {
    errorMessage.value = "Name, Phone, and Message are required.";
    isSubmitting.value = false;
    return;
  }

  try {
    // 1. Save data to Supabase (Database record)
    // Mapping to the new 'cycle_shop_inquiries' schema
    const { error: dbError } = await supabase.from(ENQUIRY_TABLE).insert({
      name: enquiryForm.name,
      email: enquiryForm.email || null, // Optional
      phone: enquiryForm.phone,
      message: enquiryForm.message,
      cycle_id: cycle.id,
      shop_id: DEFAULT_SHOP_ID, // Required by schema
      status: DEFAULT_STATUS, // Required by schema
      is_read: false, // Default value
      cycle_name: cycle.model_name,
    });

    if (dbError) throw dbError;

    toast.add({
      severity: "success",
      summary: "Enquiry submitted successfully!",
      detail: "Redirecting to WhatsApp...",
      life: 3000,
    });

    setTimeout(() => {
      // Optionally reset form
      enquiryForm.name = "";
      enquiryForm.email = "";
      enquiryForm.phone = "";
      enquiryForm.message = "";
    }, 1500);
  } catch (error) {
    console.error("Enquiry submission failed:", error);
    errorMessage.value = "Enquiry submission failed. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: `${cycle.model_name} | ${cycle[BRAND_TABLE]?.name} - Cycle Shop`,
  meta: [
    {
      name: "description",
      content: `Buy ${cycle.model_name} cycle. Price: ${
        cycle.price
      } BDT. ${cycle.description.substring(0, 100)}...`,
    },
    { property: "og:title", content: cycle.model_name },
    {
      property: "og:description",
      content: cycle.description.substring(0, 150),
    },
    {
      property: "og:image",
      content: selectedPhoto.value || "Default Image URL",
    },
  ],
});
onMounted(async () => {
  await updateCycleViews();
});
</script>

<style scoped></style>
