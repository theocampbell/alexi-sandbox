<script setup lang="ts">
import { formatEuros, type PointDette } from '../data'
import TableauDsfr from './TableauDsfr.vue'

withDefaults(defineProps<{ points: PointDette[]; titre?: string }>(), {
  titre: 'Informations sur la dette locative',
})

const euros = (n: number | null) => (n === null ? 'Non renseigné' : formatEuros(n))
const pourcentage = (n: number | null) => (n === null ? 'Non renseigné' : `${n} %`)
</script>

<template>
  <!-- Mêmes colonnes que le tableau de la dette de l'application en production -->
  <TableauDsfr
    :titre="titre"
    multiligne
    :entetes="[
      'Origine de l’information',
      'Date de mise à jour',
      'Montant de la dette locative',
      'Dont loyer',
      'Dont charges',
      'Dont frais annexes',
      'Part de la dette locative sur l’ensemble des dettes',
    ]"
  >
    <tr v-for="(p, i) in points" :key="i">
      <td>{{ p.origine }}</td>
      <td>{{ p.date }}</td>
      <td><strong>{{ formatEuros(p.montant) }}</strong></td>
      <td>{{ euros(p.loyer) }}</td>
      <td>{{ euros(p.charges) }}</td>
      <td>{{ euros(p.fraisAnnexes) }}</td>
      <td>{{ pourcentage(p.partSurDettes) }}</td>
    </tr>
  </TableauDsfr>
</template>
