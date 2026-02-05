<template>
    <div>
      <h3>Choisir un créneau avec Dr. {{ medecin.nom }}</h3>
  
      <div class="days">
        <div
          v-for="(dispo, index) in disponibilites"
          :key="index"
          class="day-column"
        >
          <h5>{{ formatDate(dispo.date) }}</h5>
          <div class="slots">
            <button
              v-for="(heure, i) in dispo.creneaux"
              :key="i"
              class="slot-btn"
              @click="reserver(dispo.date, heure)"
            >
              {{ heure }}
            </button>
          </div>
        </div>
      </div>
  
      <p v-if="message" style="margin-top: 10px">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
  import { db } from '@/firebase-config';
  
  export default {
    props: ['medecin'], // Doit contenir .nom (medcinNom)
    data() {
      return {
        disponibilites: [],
        message: ''
      };
    },
    methods: {
      async fetchDisponibilites() {
        const q = query(
          collection(db, 'disponibilites'),
          where('medcinNom', '==', this.medecin.nom)
        );
  
        const snapshot = await getDocs(q);
        this.disponibilites = snapshot.docs.map(doc => ({
          ...doc.data()
        }));
      },
      formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: '2-digit',
          month: 'short'
        });
      },
      async reserver(date, heure) {
        try {
          await addDoc(collection(db, 'rendezvous'), {
            medcinNom: this.medecin.nom,
            date,
            heure,
            status: 'Confirmé',
            patientID: '12345' // À adapter dynamiquement
          });
          this.message = `✅ Rendez-vous confirmé le ${date} à ${heure}`;
        } catch (error) {
          console.error(error);
          this.message = "❌ Erreur lors de la réservation";
        }
      }
    },
    mounted() {
      this.fetchDisponibilites();
    }
  };
  </script>
  
  <style scoped>
  .days {
    display: flex;
    gap: 20px;
  }
  .day-column {
    border: 1px solid #d6e0a0;
    padding: 10px;
    min-width: 140px;
  }
  .slots {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .slot-btn {
    background-color: #28a745;
    border: none;
    color: rgb(26, 88, 116);
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  .slot-btn:hover {
    background-color: #218838;
  }
  </style>