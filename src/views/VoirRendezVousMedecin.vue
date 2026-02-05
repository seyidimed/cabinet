<template>
    <div class="container">
      <h2>📋 Rendez-vous du jour</h2>
  
      <table v-if="rendezvous.length" class="table">
        <thead>
          <tr>
            <th>Heure</th>
            <th>Patient</th>
            <th>Type</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rdv in rendezvous" :key="rdv.id">
            <td>{{ rdv.heure }}</td>
            <td>{{ rdv.nomPatient || rdv.userNom || '—' }}</td>
            <td>{{ rdv.nomPatient ? 'sur place' : 'en ligne' }}</td>
            <td>{{ rdv.status }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>Aucun rendez-vous prévu pour aujourd'hui.</p>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase-config';
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc
  } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        rendezvous: []
      };
    },
    methods: {
      async fetchRendezVous() {
        const user = auth.currentUser;
        if (!user) return;
  
        const today = new Date().toISOString().slice(0, 10);
        const q = query(
          collection(db, 'rendezvous'),
          where('medecinID', '==', user.uid),
          where('date', '==', today)
        );
  
        const snapshot = await getDocs(q);
        const temp = [];
  
        for (const docSnap of snapshot.docs) {
          const rdv = docSnap.data();
          const rdvObj = { id: docSnap.id, ...rdv };
  
          if (!rdv.nomPatient) {
  if (rdv.patientID) {
    try {
      const userRef = doc(db, 'users', rdv.patientID);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const user = userSnap.data();
        rdvObj.userNom = `${user.prenom} ${user.nom}`;
      } else {
        rdvObj.userNom = '—';
      }
    } catch (err) {
      console.error('Erreur récupération patient en ligne:', err);
      rdvObj.userNom = '—';
    }
  } else {
    rdvObj.userNom = '—';
  }
}
  
          temp.push(rdvObj);
        }
  
        this.rendezvous = temp;
      }
    },
    mounted() {
      this.fetchRendezVous();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
    margin: auto;
    padding: 30px;
  }
  
  h2 {
    color: #00796b;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .table th, .table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .table th {
    background-color: #00796b;
    color: white;
  }
  </style>