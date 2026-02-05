<template>
    <div class="rdv-form">
      <h3>➕ Prendre un rendez-vous pour un patient sur place</h3>
  
      <input v-model="nomPatient" class="form-control" placeholder="Nom complet du patient" />
      <input v-model="telephone" class="form-control" placeholder="Téléphone" />
  
      <select v-model="selectedMedecin" class="form-control">
        <option disabled value="">-- Sélectionnez un médecin --</option>
        <option v-for="med in medecins" :key="med.id" :value="med">{{ med.nom }}</option>
      </select>
  
      <input v-model="date" class="form-control" type="date" />
  
      <select v-model="heure" class="form-control">
        <option disabled value="">-- Sélectionnez un créneau --</option>
        <option v-for="slot in creneauxDispos" :key="slot">{{ slot }}</option>
      </select>
  
      <button class="btn btn-primary mt-3" @click="ajouterRdv">Enregistrer le rendez-vous</button>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebase-config';
  import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        nomPatient: '',
        telephone: '',
        date: '',
        heure: '',
        selectedMedecin: '',
        medecins: [],
        creneauxDispos: [],
        message: ''
      };
    },
    methods: {
      async chargerMedecins() {
        const snap = await getDocs(collection(db, 'medecins'));
        this.medecins = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
  
      async chargerCreneaux() {
        if (!this.selectedMedecin || !this.date) return;
  
        const dispoQuery = query(
          collection(db, 'disponibilites'),
          where('medcinNom', '==', this.selectedMedecin.nom),
          where('date', '==', this.date)
        );
  
        const snapshot = await getDocs(dispoQuery);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          const tous = data.creneaux;
  
          // Supprimer les créneaux déjà pris
          const rdvQuery = query(
            collection(db, 'rendezvous'),
            where('medcinNom', '==', this.selectedMedecin.nom),
            where('date', '==', this.date)
          );
          const rdvSnap = await getDocs(rdvQuery);
          const pris = rdvSnap.docs.map(d => d.data().heure);
  
          this.creneauxDispos = tous.filter(h => !pris.includes(h));
        } else {
          this.creneauxDispos = [];
        }
      },
  
      async ajouterRdv() {
        if (!this.nomPatient || !this.telephone || !this.selectedMedecin || !this.date || !this.heure) {
          alert("Veuillez remplir tous les champs.");
          return;
        }
  
        const rdv = {
          nomPatient: this.nomPatient,
          telephone: this.telephone,
          medcinNom: this.selectedMedecin.nom,
          medecinID: this.selectedMedecin.id,
          date: this.date,
          heure: this.heure,
          status: "Confirmé",
          typeRdv: "cabinet",
          createdAt: new Date()
        };
  
        try {
          await addDoc(collection(db, 'rendezvous'), rdv);
          this.message = "✅ Rendez-vous enregistré avec succès.";
          this.nomPatient = '';
          this.telephone = '';
          this.heure = '';
          this.creneauxDispos = [];
        } catch (e) {
          this.message = "❌ Erreur : " + e.message;
        }
      }
    },
    watch: {
      date() {
        this.chargerCreneaux();
      },
      selectedMedecin() {
        this.chargerCreneaux();
      }
    },
    async mounted() {
      await this.chargerMedecins();
    }
  };
  </script>
  
  <style scoped>
  .rdv-form {
    max-width: 600px;
    margin: auto;
    padding: 25px;
    background: #f0fdfa;
    border-left: 6px solid #00796b;
    border-radius: 10px;
  }
  
  input, select {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 18px;
    font-size: 16px;
    background-color: #00796b;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #005f56;
  }
  </style>