<template>
    <div class="liste-attente-container">
      <h2 class="title">📋 Liste d'attente - Patients sur place</h2>
  
      <div v-if="liste.length === 0" class="empty">
        Aucun patient sur place en attente.
      </div>
  
      <table v-else class="attente-table">
        <thead>
          <tr>
            <th>Nom du patient</th>
            <th>Médecin</th>
            <th>Heure</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in liste" :key="item.id">
            <td>{{ item.nomPatient }}</td>
            <td>{{ item.medcinNom }}</td>
            <td>{{ item.heure }}</td>
            <td>{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebase-config';
  import { collection, getDocs, query, where } from 'firebase/firestore';
  
  export default {
    name: "ListeAttente",
    data() {
      return {
        liste: [],
      };
    },
    methods: {
      async fetchListeAttente() {
        try {
          const q = query(
            collection(db, 'liste_attente'),
            where('type', '==', 'sur place') // ✅ filtre uniquement les patients sur place
          );
          const snapshot = await getDocs(q);
          this.liste = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error("Erreur chargement liste d'attente :", error);
          alert("Impossible de charger la liste.");
        }
      }
    },
    mounted() {
      this.fetchListeAttente();
    }
  };
  </script>
  
  <style scoped>
  .liste-attente-container {
    max-width: 900px;
    margin: auto;
    padding: 30px;
  }
  
  .title {
    text-align: center;
    font-size: 26px;
    margin-bottom: 20px;
    color: #00796b;
  }
  
  .empty {
    text-align: center;
    font-style: italic;
    color: #777;
  }
  
  .attente-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .attente-table th,
  .attente-table td {
    padding: 14px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  
  .attente-table th {
    background-color: #00796b;
    color: white;
  }
  
  .attente-table tr:hover {
    background-color: #f0f0f0;
  }
  </style>