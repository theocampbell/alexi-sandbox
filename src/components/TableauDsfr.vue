<script setup lang="ts">
/**
 * Tableau au balisage DSFR 1.14 (fr-table__wrapper / container / content) :
 * il défile dans son cadre sur petit écran et à 400 % de zoom.
 * DsfrTable produit l'ancien balisage et DsfrDataTable rend chaque cellule focusable
 * (une tabulation par cellule), d'où ce petit composant.
 */
defineProps<{
  /** Légende du tableau (lue par les lecteurs d'écran) */
  titre: string
  /** En-têtes de colonne */
  entetes: string[]
  /** Affiche la légende à l'écran */
  legendeVisible?: boolean
  /** Laisse le texte des cellules passer à la ligne (fr-table--multiline) */
  multiligne?: boolean
}>()
</script>

<template>
  <div class="fr-table fr-mb-0" :class="{ 'fr-table--no-caption': !legendeVisible, 'fr-table--multiline': multiligne }">
    <div class="fr-table__wrapper">
      <!-- Zone qui défile : atteignable au clavier et nommée par la légende (RGAA 7.3 / WCAG 2.1.1) -->
      <div class="fr-table__container" tabindex="0" role="region" :aria-label="titre">
        <div class="fr-table__content">
          <table>
            <caption>{{ titre }}</caption>
            <thead>
              <tr>
                <th v-for="e in entetes" :key="e" scope="col">
                  <slot name="entete" :entete="e">{{ e }}</slot>
                </th>
              </tr>
            </thead>
            <tbody>
              <slot />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
