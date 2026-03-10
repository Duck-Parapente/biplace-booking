<template>
  <p>
    Soit tu n'as pas cloturé une de tes réservations précédentes, soit ton compte est désactivé
    parce que tu n'as pas payé ton supplément de cotisation biplace annuel. <br />
    <a :href="adhesionLink">Tu peux le faire avec ce lien</a>. Dès que c'est fait, envoie un message
    <a :href="biplaceReservationsChannel"> sur discord</a>
    afin qu'admin réactive ton compte.
  </p>
</template>

<script setup lang="ts">
import { adhesionLink, biplaceReservationsChannel } from '~/config/links.config';
</script>
