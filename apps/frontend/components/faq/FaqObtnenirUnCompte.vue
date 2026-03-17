<template>
  <div>
    <p hidden>charte</p>
      <p class="mb-3">
En premier, lieu, tu dois templir les prérequis suivants :
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Être à jour de ta cotisation au Duck parapente.</li>
        <li>
          Avoir payé le supplément de cotisation biplace sur
          <a :href="adhesionLink">helloasso</a>.
        </li>
      <li>Avoir envoyé ton chèque de caution au président du Duck.</li>
      <li>
        Etre qualifié biplace ou en cours de formation (= BPC minimum et pré-formation en vue).
      </li>
      <li>
        Avoir LU ET signé et envoyé la
        <a href="https://drive.google.com/file/d/1GSdB7lp_31N4jSX0m7lzxjC3m1EXwyn0/view">
          convention de réservation</a
        >
        au président du Duck.
      </li>
    </ul>
    <br />
    <p class="mb-3">
      Si tu coches toutes les cases, tu peux demander la création de ton compte sur le channel
      <a :href="biplaceReservationsChannel">discord biplace-reservations</a>. Prévois un peu de
      délai.
    </p>
  </div>
</template>

<script setup lang="ts">
import { adhesionLink, biplaceReservationsChannel } from '~/config/links.config';
</script>
