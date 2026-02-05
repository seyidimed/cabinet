// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import MyMedicalHistory from '@/views/MyMedicalHistory.vue'


const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/patient',
    name: 'PatientHome',
    component: () => import('@/views/PatientHome.vue')
  },
  {
    path: '/professionnel',
    name: 'ProfessionalHome',
    component: () => import('@/views/ProfessionalHome.vue')
  },
  {
    path: '/secretaire',
    name: 'SecretaireHome',
    component: () => import('@/views/SecretaireHome.vue')
  },
  {
    path: '/prendre-rendez-vous',
    name: 'PrendreRendezVous',
    component: () => import('@/views/PrendreRendezVous.vue')
  },
  {
    path: '/mes-rendezvous',
    name: 'MesRendezvous',
    component: () => import('@/views/MesRendezvous.vue') // Chemin à adapter selon ta structure
  },
  {
    path: '/modifier-rendez-vous',
    name: 'modifier-rendezvous',
    component: () => import('@/views/ModifierRendezVous.vue'),
    props: true
  },
  {
    
      path: '/disponibilite-form',
      name: 'DisponibiliteForm',
      component: () => import('@/views/DisponibiliteForm.vue'),
      meta: { requiresSecretaire: true } // ✅ protégé
    
  
  },
  {
    path: '/ajouter-rdv-sur-place',
    name: 'AjouterRdvSurPlace',
    component: () => import('@/views/AjouterRdvSurPlace.vue')
  },
  {
    path: '/rdv-du-jour',
    name: 'RendezVousDuJour',
    component: () => import('@/views/RendezVousDuJour.vue')
  },
  {
    path: '/modifier-rdv-secretaire',
    name: 'ModifierRdvSecretaire',
    component: () => import('@/views/ModifierRdvSecretaire.vue'),
    props: true
  },
  {
    path: '/liste-attente',
    name: 'ListeAttente',
    component: () => import('@/views/ListeAttente.vue')
  },
  {
    path: '/medecin',
    name: 'MedecinHome',
    component: () => import('@/views/MedecinHome.vue') // ou ton chemin exact
  },
  {
    path: '/voir-rendezvous-medecin',
    name: 'VoirRendezVousMedecin',
    component: () => import('@/views/VoirRendezVousMedecin.vue')
  },
  {
    path: '/ajouter-compte-rendu',
    name: 'AjouterCompteRendu',
    component: () => import('@/views/AjouterCompteRendu.vue')
  },
  {
    path: '/my-medical-history',
    name: 'MyMedicalHistory',
    component: MyMedicalHistory
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
