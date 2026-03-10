<template>
  <div>
    <p class="mb-3">Pour toute question supplémentaire ou problème technique, tu peux :</p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        Consulter la page
        <NuxtLink to="/contacts">Contacts</NuxtLink>
        pour joindre un autre canard.
      </li>
      <li>
        Envoyer un message sur
        <a :href="biplaceReservationsChannel"> Discord </a>
      </li>
      <li>
        <a :href="`mailto:${config.public.supportEmail}`"> Envoyer un email au support </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { biplaceReservationsChannel } from '~/config/links.config';

const config = useRuntimeConfig();
</script>
