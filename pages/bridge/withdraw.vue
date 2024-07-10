<template>
  <ModalTransactionWithdrawalUnavailable />

  <div v-if="withdrawalsDisabled">
    <PageTitle>Bridge</PageTitle>
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>
        {{ eraNetwork.name }} is going through an upgrade and withdrawals are disabled until it is finished (expected
        May 7th 18h00 UTC). Please come back later.
      </p>
    </CommonAlert>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-block-gap">
      <CommonButton as="RouterLink" :to="{ name: 'assets' }" size="xs">Go to Assets page</CommonButton>
      <CommonButton size="xs" as="RouterLink" :to="{ name: 'bridge' }">Bridge to {{ eraNetwork.name }}</CommonButton>
    </div>
  </div>
  <TransferView v-else type="withdrawal" />
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

import { bridge as bridgeMeta } from "@/data/meta";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import TransferView from "@/views/transactions/Transfer.vue";

useSeoMeta({
  title: bridgeMeta.title,
  ogTitle: bridgeMeta.title,
  description: bridgeMeta.description,
  ogDescription: bridgeMeta.description,
  ogImage: bridgeMeta.previewImg.src,
  ogImageAlt: bridgeMeta.previewImg.alt,
  twitterCard: "summary_large_image",
  twitterImage: bridgeMeta.previewImg.src,
  twitterImageAlt: bridgeMeta.previewImg.alt,
});

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const withdrawalsDisabled = computed(() => false);
</script>

<style lang="scss" scoped></style>
