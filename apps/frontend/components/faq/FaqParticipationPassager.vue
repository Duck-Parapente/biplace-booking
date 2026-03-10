<template>
  <div>
    <p>
      Pas de chance ! Tu n'agis pas dans le cadre de d'une activité professionnelle, tu ne peux pas
      encaisser d'argent pour te payer la Rolex de Rihana. Par contre, tu peux suggérer à ton
      passager de faire un don au club et ainsi le dédommager de l'usure du matériel.
      <br />
      A titre d'information, un vol coûte environ 20€ de frais d'achat et d'entretien.<br />
      <a :href="participationLink">Ceci est le lien de l'helloasso du club.</a>
    </p>
    <p>
      Tu peux également lui faire flasher ce QR code pour faire un don directement depuis son
      téléphone. Il faut battre le fer tant qu'il est chaud !<br />

      <img
        src="~/assets/png/qr-participation.png"
        alt="QR Code participation biplace"
        class="w-64 h-auto mx-auto my-4 rounded-lg"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import { participationLink } from '~/config/links.config';
</script>
