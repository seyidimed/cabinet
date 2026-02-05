<template>
  <div class="container">
    <h2>🧾 Ajouter un compte rendu</h2>

    <div class="form-group">
      <label for="patientID">Sélectionner un patient</label>
      <select v-model="selectedPatientID">
        <option disabled value="">-- Choisir --</option>
        <option v-for="p in patientsDuJour" :key="p.id" :value="p.id">
          {{ p.nom }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="cr">Contenu du compte rendu</label>
      <textarea v-model="Note" rows="6" placeholder="Écrire ici..."></textarea>
    </div>

    <button @click="enregistrer">Enregistrer</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { db, auth } from '@/firebase-config';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc
} from 'firebase/firestore';

export default {
  data() {
    return {
      Note: "",
      selectedPatientID: "",
      patientsDuJour: [],
      message: ""
    };
  },
  async mounted() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const currentUser = auth.currentUser;
      const medRef = doc(db, "medecins", currentUser.uid);
      const medSnap = await getDoc(medRef);
      const medecinNom = medSnap.data().nom;

      const q = query(
        collection(db, "rendezvous"),
        where("date", "==", today),
        where("medcinNom", "==", medecinNom)
      );

      const querySnapshot = await getDocs(q);
      this.patientsDuJour = [];

      for (const docSnap of querySnapshot.docs) {
        const d = docSnap.data();
        const patientRef = doc(db, "users", d.patientID);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          const patient = patientSnap.data();
          this.patientsDuJour.push({
            id: d.patientID,
            nom: `${patient.prenom} ${patient.nom}`
          });
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des patients :", err);
    }
  },
  methods: {
    async enregistrer() {
      try {
        const medID = auth.currentUser.uid;
        const medRef = doc(db, "medecins", medID);
        const medSnap = await getDoc(medRef);
        const nomMedecin = medSnap.data().nom;

        const patRef = doc(db, "users", this.selectedPatientID);
        const patSnap = await getDoc(patRef);
        const nomPatient = `${patSnap.data().prenom} ${patSnap.data().nom}`;

        await addDoc(collection(db, "comptesRendus"), {
          Note: this.Note,
          patientID: this.selectedPatientID,
          medecinID: medID,
          nomMedecin,
          nomPatient,
          date: new Date().toISOString()
        });

        this.message = "✅ Compte rendu enregistré";
        this.Note = "";
        this.selectedPatientID = "";
      } catch (err) {
        console.error("Erreur enregistrement CR :", err);
        this.message = "❌ Erreur d'enregistrement";
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #00796b;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
}

textarea,
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-family: inherit;
}

button {
  width: 100%;
  background-color: #009688;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 1em;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #00796b;
}
</style>
