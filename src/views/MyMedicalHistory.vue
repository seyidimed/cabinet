<template>
    <div class="container ordonnance-page my-5">
      <h2 class="text-center mb-4">
        📂 <strong>Mes ordonnances</strong>
      </h2>
  
      <div v-if="comptesRendus.length">
        <div v-for="cr in comptesRendus" :key="cr.date" class="card shadow-sm mb-4 border-start border-success border-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="mb-0 text-primary-emphasis">
                📅 {{ cr.date.slice(0, 10) }}
              </h5>
              <span class="text-success fw-semibold">
                👨‍⚕️ {{ cr.nomMedecin }}
              </span>
            </div>
            <div class="text-muted" style="white-space: pre-wrap;">
              {{ cr.Note }}
            </div>
          </div>
        </div>
      </div>
  
      <p v-else class="text-center text-muted">Aucune ordonnance pour le moment.</p>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase-config';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        comptesRendus: [],
      };
    },
    async mounted() {
      const user = auth.currentUser;
      if (!user) return;
  
      const q = query(
        collection(db, 'comptesRendus'),
        where('patientID', '==', user.uid)
      );
  
      const snapshot = await getDocs(q);
      this.comptesRendus = snapshot.docs.map(doc => doc.data());
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  
  .ordonnance-page {
    font-family: 'Poppins', sans-serif;
  }
  
  .card {
    background-color: #e0f7fa;
    border-radius: 12px;
  }
  
  .card h5 {
    font-size: 1.2rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card .text-muted {
    font-size: 0.95rem;
    color: #333;
  }
  </style>
  