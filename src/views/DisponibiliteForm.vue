<template>
  <div class="background">
    <div class="container">
      <!-- Titre de bienvenue -->
      <h2 class="welcome">Bienvenue Secrétaire</h2>

      <!-- Titre secondaire -->
      <h3>Définir les créneaux disponibles</h3>

      <!-- Champ : nom du médecin (menu déroulant) -->
      <div class="form-group">
        <label for="medcin">Nom du médecin</label>
        <select v-model="medcinNom" id="medcin">
          <option disabled value="">-- Sélectionnez un médecin --</option>
          <option v-for="nom in medecins" :key="nom" :value="nom">Dr {{ nom }}</option>
        </select>
      </div>

      <!-- Champ : date -->
      <div class="form-group">
        <label for="date">Date</label>
        <input v-model="date" type="date" id="date" />
      </div>

      <!-- Liste des créneaux horaires -->
      <div class="slots">
        <label v-for="heure in allSlots" :key="heure" class="slot">
          <input type="checkbox" :value="heure" v-model="creneaux" />
          {{ heure }}
        </label>
      </div>

      <!-- Bouton d'enregistrement -->
      <button class="submit-button" @click="enregistrer">Enregistrer</button>

      <!-- Message de confirmation -->
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase-config'; // ⚠️ adapte ce chemin si nécessaire

export default {
  data() {
    return {
      medcinNom: '',
      medecins: [],  // Liste des médecins
      date: '',
      creneaux: [],
      message: '',
      allSlots: [
        "09:00", "09:15", "09:30", "09:45", "10:00", "10:15",
        "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
        "12:00", "12:15", "12:30", "12:45", "14:30", "14:45",
        "15:00", "15:15", "15:30", "15:45", "16:00", "16:15",
        "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00"
      ]
    };
  },
  methods: {
    async enregistrer() {
      try {
        await axios.post('http://localhost:3001/api/disponibilites', {
          medcinNom: this.medcinNom,
          date: this.date,
          creneaux: this.creneaux
        });
        this.message = "✅ Créneaux enregistrés avec succès";
        this.creneaux = [];
      } catch (err) {
        this.message = "❌ Erreur : " + err.message;
      }
    },
    async fetchMedecins() {
      try {
        const snapshot = await getDocs(collection(db, 'medecins'));
        this.medecins = snapshot.docs.map(doc => doc.data().nom);
      } catch (err) {
        this.message = "❌ Erreur lors du chargement des médecins";
      }
    }
  },
  mounted() {
    this.fetchMedecins();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

/* Arrière-plan global */
.background {
  min-height: 100vh;
  background: linear-gradient(to right, #e0f7fa, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
  font-family: 'Poppins', sans-serif;
}

/* Conteneur principal */
.container {
  width: 100%;
  max-width: 650px;
  background: white;
  border-radius: 16px;
  padding: 2.5em;
  box-shadow: 0 4px 30px rgba(0, 105, 130, 0.15);
  position: relative;
}

/* Titre de bienvenue */
.welcome {
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 1em;
  color: #006064;
}

/* Titre principal */
h3 {
  text-align: center;
  color: #007b9f;
  margin-bottom: 1.5em;
}

/* Groupe de champ */
.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.4em;
}

/* Champs de texte et menu déroulant */
input[type="text"],
input[type="date"],
select {
  width: 100%;
  padding: 0.7em;
  border: 1px solid #cfd8dc;
  border-radius: 10px;
  font-size: 1em;
  font-family: 'Poppins', sans-serif;
}

/* Créneaux horaires */
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 1.2em 0;
  justify-content: center;
}

.slot {
  background: #e0f2f1;
  border: 1px solid #b2dfdb;
  padding: 0.5em 0.9em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
}

.slot:hover {
  background: #b2dfdb;
}

.slot input {
  margin-right: 5px;
}

/* Bouton principal */
.submit-button {
  width: 100%;
  background-color: #00838f;
  color: white;
  padding: 0.9em;
  font-size: 1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #006064;
}

/* Message d’état */
.message {
  text-align: center;
  margin-top: 1.3em;
  font-weight: bold;
  color: #007b9f;
}
</style>
