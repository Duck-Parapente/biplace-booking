<template>
  <p class="mb-3">
    Tu peux les contacter à travers le
    <a :href="biplaceReservationsChannel"> Discord </a>
    ou
    <a :href="`mailto:${config.public.supportEmail}`"> en envoyant un email au support </a>. Il
    seront très heureux de résoudre tes problèmes liés à la réservation des biplaces.<br />
    Pense néanmoins, qu'ils ont des métiers et qu'ils vont parfois voler. Si tu t'y prends une heure
    avant ta deadline, tu risques de rester avec ton problème.
  </p>
</template>

<script setup lang="ts">
import { biplaceReservationsChannel } from '~/config/links.config';

const config = useRuntimeConfig();
</script>
