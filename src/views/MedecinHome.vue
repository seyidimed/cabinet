<template>
  <div class="container-fluid min-vh-100 py-5 docteur-bg">
    <div class="row align-items-start">
      <!-- Colonne gauche : boutons verticaux -->
      <div class="col-md-6">
        <div class="d-flex flex-column gap-3 align-items-start ps-5">
          <router-link to="/voir-rendezvous-medecin" class="btn nav-btn w-75">
            📅 Voir les rendez-vous
          </router-link>
          <router-link to="/ajouter-compte-rendu" class="btn nav-btn w-75">
            🧾 Prescrire une ordonnance
          </router-link>
          <router-link to="/fiche-patient" class="btn nav-btn w-75">
            📁 Fiche patient
          </router-link>
          <router-link to="/historique-consultation" class="btn nav-btn w-75">
            📊 Historique
          </router-link>
        </div>
      </div>

      <!-- Colonne droite : image du docteur + bouton déconnexion en haut -->
      <div class="col-md-6 position-relative text-center">
        <!-- Bouton Déconnexion en haut à droite -->
        <div class="text-end pe-4 pt-2">
          <button class="btn btn-outline-danger fw-bold" @click="logout">
            🔒 Déconnexion
          </button>
        </div>
        <!-- Image du docteur -->
        <img :src="logoMedecin" alt="Docteur" class="logo-docteur-image-large mt-3" />
      </div>
    </div>

    <!-- Section rendez-vous du jour -->
    <div class="card shadow-sm mt-5 mx-auto" style="max-width: 900px;">
      <div class="card-header bg-white border-bottom d-flex align-items-center">
        <h5 class="mb-0 text-primary">
          <i class="fas fa-calendar-alt me-2"></i>Rendez-vous du jour
        </h5>
        <span class="badge bg-primary ms-2">{{ rendezvous.length }}</span>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Heure</th>
              <th scope="col">Patient</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rendezvous.length === 0">
              <td colspan="2" class="text-center text-muted">Aucun rendez-vous pour aujourd'hui</td>
            </tr>
            <tr v-for="rdv in rendezvous" :key="rdv.id">
              <td><i class="far fa-clock me-1"></i>{{ rdv.heure }}</td>
              <td><strong>{{ rdv.patientNom || 'Patient inconnu' }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase-config';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import logoMedecin from '@/assets/image.png'; // Logo déjà importé

export default {
  name: "MedecinHome",
  data() {
    return {
      userData: {},
      rendezvous: [],
      logoMedecin,
    };
  },
  methods: {
    async fetchMedecinInfo() {
      const user = auth.currentUser;
      if (!user) {
        alert("Veuillez vous connecter.");
        this.$router.push({ name: 'login' });
        return;
      }

      const medecinRef = doc(db, 'medecins', user.uid);
      const medecinSnap = await getDoc(medecinRef);
      if (medecinSnap.exists()) {
        this.userData = medecinSnap.data();
        this.fetchRendezVousDuJour(this.userData.nom);
      } else {
        alert("Médecin non trouvé.");
        this.$router.push({ name: 'login' });
      }
    },

    async fetchRendezVousDuJour(medcinNom) {
      const today = new Date().toISOString().slice(0, 10);
      const q = query(
        collection(db, 'rendezvous'),
        where('date', '==', today),
        where('medcinNom', '==', medcinNom)
      );

      const snapshot = await getDocs(q);
      const rdvs = [];

      for (const docSnap of snapshot.docs) {
        const rdv = docSnap.data();
        const rdvObj = { id: docSnap.id, ...rdv };

        if (rdv.nomPatient) {
          rdvObj.patientNom = rdv.nomPatient;
        } else if (rdv.patientID) {
          try {
            const userRef = doc(db, 'users', rdv.patientID);
            const userSnap = await getDoc(userRef);
            rdvObj.patientNom = userSnap.exists()
              ? `${userSnap.data().prenom} ${userSnap.data().nom}`
              : 'Patient inconnu';
          } catch (err) {
            console.error('Erreur utilisateur :', err);
            rdvObj.patientNom = 'Patient inconnu';
          }
        } else {
          rdvObj.patientNom = 'Patient inconnu';
        }

        rdvs.push(rdvObj);
      }

      this.rendezvous = rdvs;
    },

    async logout() {
      await signOut(auth);
      this.$router.push({ name: 'login' });
    }
  },
  mounted() {
    this.fetchMedecinInfo();
  }
};
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

.nav-btn {
  background-color: #2A5C99 !important;
  color: #fff !important;
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  padding: 12px 20px;
  transition: background 0.2s ease;
  text-align: left;
}
.nav-btn:hover {
  background-color: #1d3e66 !important;
  color: #fff !important;
}

.logo-docteur-image-large {
  max-height: 400px;
  width: auto;
  border-radius: 16px;
  margin-top: 40px;
}

.docteur-bg {
  background-color: #e6f3fd;
}
</style>
